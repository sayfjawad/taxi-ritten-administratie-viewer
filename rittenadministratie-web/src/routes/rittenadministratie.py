from flask import Blueprint, jsonify, request
import xml.etree.ElementTree as ET
import uuid
import os
import json
from datetime import datetime
import pandas as pd
from io import BytesIO

rittenadministratie_bp = Blueprint("rittenadministratie", __name__)

# Tijdelijke opslag voor sessies
sessions = {}

def parse_xml_to_data(xml_content):
    """Parse XML content en converteer naar gestructureerde data"""
    try:
        root = ET.fromstring(xml_content)
        
        # Namespace handling
        namespaces = {
            "ns": "http://www.ritadministratie.org",
            "env": "urn:envelope"
        }
        
        ritten = []
        
        # Zoek naar alle rit elementen onder de juiste namespace
        for rit in root.findall(".//ns:Rit", namespaces):
            data_elem = rit.find("ns:Data", namespaces)
            if data_elem is not None:
                rit_data = {}
                
                # Basis rit informatie
                rit_id_elem = data_elem.find("ns:RtVgNr", namespaces)
                rit_data["rit_id"] = rit_id_elem.text if rit_id_elem is not None else ""
                
                dat_td_reg_elem = data_elem.find("ns:DatTdReg", namespaces)
                rit_data["datum_tijd_registratie"] = dat_td_reg_elem.text if dat_td_reg_elem is not None else ""
                
                type_elem = data_elem.find("ns:Type", namespaces)
                rit_data["type"] = type_elem.text if type_elem is not None else ""
                
                # Bestuurder informatie
                bestuurder = data_elem.find("ns:Bestuurder", namespaces)
                if bestuurder is not None:
                    ch_id_nr_elem = bestuurder.find("ns:ChIdNr", namespaces)
                    rit_data["bestuurder_id"] = ch_id_nr_elem.text if ch_id_nr_elem is not None else ""
                else:
                    rit_data["bestuurder_id"] = ""
                
                # Kilometerstand
                km_stand_begin_elem = data_elem.find("ns:KmStdBeg", namespaces)
                rit_data["km_stand_begin"] = km_stand_begin_elem.text if km_stand_begin_elem is not None else ""
                
                km_stand_eind_elem = data_elem.find("ns:KmStdEnd", namespaces)
                rit_data["km_stand_eind"] = km_stand_eind_elem.text if km_stand_eind_elem is not None else ""
                
                # Prijs
                prijs_elem = data_elem.find("ns:Prijs", namespaces)
                rit_data["prijs"] = prijs_elem.text if prijs_elem is not None else ""
                
                # Locatie begin
                loc_beg = data_elem.find("ns:LocBeg", namespaces)
                if loc_beg is not None:
                    lat_elem = loc_beg.find("ns:Lat", namespaces)
                    lon_elem = loc_beg.find("ns:Lon", namespaces)
                    rit_data["latitude_begin"] = lat_elem.text if lat_elem is not None else ""
                    rit_data["longitude_begin"] = lon_elem.text if lon_elem is not None else ""
                else:
                    rit_data["latitude_begin"] = ""
                    rit_data["longitude_begin"] = ""
                
                # Locatie eind
                loc_end = data_elem.find("ns:LocEnd", namespaces)
                if loc_end is not None:
                    lat_elem = loc_end.find("ns:Lat", namespaces)
                    lon_elem = loc_end.find("ns:Lon", namespaces)
                    rit_data["latitude_eind"] = lat_elem.text if lat_elem is not None else ""
                    rit_data["longitude_eind"] = lon_elem.text if lon_elem is not None else ""
                else:
                    rit_data["latitude_eind"] = ""
                    rit_data["longitude_eind"] = ""
                
                ritten.append(rit_data)
        
        return ritten
    except ET.ParseError as e:
        raise ValueError(f"XML parsing error: {str(e)}")
    except Exception as e:
        raise ValueError(f"Error processing XML: {str(e)}")

@rittenadministratie_bp.route("/upload", methods=["POST"])
def upload_xml():
    """Upload en verwerk XML bestand"""
    try:
        if "file" not in request.files:
            return jsonify({"error": "Geen bestand gevonden"}), 400
        
        file = request.files["file"]
        if file.filename == "":
            return jsonify({"error": "Geen bestand geselecteerd"}), 400
        
        if not file.filename.lower().endswith(".xml"):
            return jsonify({"error": "Alleen XML bestanden zijn toegestaan"}), 400
        
        # Lees XML content
        xml_content = file.read().decode("utf-8")
        
        # Parse XML naar data
        ritten_data = parse_xml_to_data(xml_content)
        
        # Genereer sessie ID
        session_id = str(uuid.uuid4())
        
        # Sla data op in sessie
        sessions[session_id] = {
            "filename": file.filename,
            "upload_time": datetime.now().isoformat(),
            "data": ritten_data,
            "total_records": len(ritten_data)
        }
        
        return jsonify({
            "session_id": session_id,
            "filename": file.filename,
            "total_records": len(ritten_data),
            "message": "Bestand succesvol geüpload en verwerkt"
        }), 200
        
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"Onverwachte fout: {str(e)}"}), 500

@rittenadministratie_bp.route("/data/<session_id>", methods=["GET"])
def get_data(session_id):
    """Haal data op voor een sessie"""
    if session_id not in sessions:
        return jsonify({"error": "Sessie niet gevonden"}), 404
    
    session_data = sessions[session_id]
    data = session_data["data"]
    
    # Paginering parameters
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 50, type=int)
    
    # Filter parameters
    search = request.args.get("search", "", type=str)
    
    # Filter data op basis van search
    if search:
        filtered_data = []
        search_lower = search.lower()
        for rit in data:
            # Zoek in alle velden
            if any(search_lower in str(value).lower() for value in rit.values()):
                filtered_data.append(rit)
        data = filtered_data
    
    # Paginering
    total = len(data)
    start = (page - 1) * per_page
    end = start + per_page
    paginated_data = data[start:end]
    
    return jsonify({
        "data": paginated_data,
        "pagination": {
            "page": page,
            "per_page": per_page,
            "total": total,
            "pages": (total + per_page - 1) // per_page
        },
        "session_info": {
            "filename": session_data["filename"],
            "upload_time": session_data["upload_time"],
            "total_records": session_data["total_records"]
        }
    })

@rittenadministratie_bp.route("/download/<session_id>", methods=["GET"])
def download_excel(session_id):
    """Download data als Excel bestand"""
    if session_id not in sessions:
        return jsonify({"error": "Sessie niet gevonden"}), 404
    
    try:
        session_data = sessions[session_id]
        data = session_data["data"]
        
        # Converteer naar DataFrame
        df = pd.DataFrame(data)
        
        # Hernoem kolommen naar Nederlandse namen
        column_mapping = {
            "rit_id": "Rit ID",
            "datum_tijd_registratie": "Datum Tijd Registratie",
            "type": "Type",
            "bestuurder_id": "Bestuurder ID",
            "km_stand_begin": "Kilometerstand Begin",
            "km_stand_eind": "Kilometerstand Eind",
            "prijs": "Prijs",
            "latitude_begin": "Latitude Begin",
            "longitude_begin": "Longitude Begin",
            "latitude_eind": "Latitude Eind",
            "longitude_eind": "Longitude Eind"
        }
        
        df = df.rename(columns=column_mapping)
        
        # Maak Excel bestand in memory
        output = BytesIO()
        with pd.ExcelWriter(output, engine="openpyxl") as writer:
            df.to_excel(writer, sheet_name="Ritadministratie", index=False)
        
        output.seek(0)
        
        # Genereer bestandsnaam
        original_filename = session_data["filename"]
        excel_filename = original_filename.replace(".xml", "_output.xlsx")
        
        from flask import Response
        return Response(
            output.getvalue(),
            mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={
                "Content-Disposition": f"attachment; filename={excel_filename}"
            }
        )
        
    except Exception as e:
        return jsonify({"error": f"Fout bij genereren Excel bestand: {str(e)}"}), 500

@rittenadministratie_bp.route("/sessions", methods=["GET"])
def get_sessions():
    """Haal alle actieve sessies op"""
    session_list = []
    for session_id, session_data in sessions.items():
        session_list.append({
            "session_id": session_id,
            "filename": session_data["filename"],
            "upload_time": session_data["upload_time"],
            "total_records": session_data["total_records"]
        })
    
    return jsonify({"sessions": session_list})

@rittenadministratie_bp.route("/sessions/<session_id>", methods=["DELETE"])
def delete_session(session_id):
    """Verwijder een sessie"""
    if session_id not in sessions:
        return jsonify({"error": "Sessie niet gevonden"}), 404
    
    del sessions[session_id]
    return jsonify({"message": "Sessie verwijderd"}), 200


