import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, Search, RefreshCw, ArrowLeft, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const DataViewer = ({ sessionData, onBack }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [sessionInfo, setSessionInfo] = useState({});

  const fetchData = async (page = 1, search = '') => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: '20',
        ...(search && { search })
      });

      const response = await fetch(`/api/data/${sessionData.session_id}?${params}`);
      const result = await response.json();

      if (response.ok) {
        setData(result.data);
        setPagination(result.pagination);
        setSessionInfo(result.session_info);
      } else {
        setError(result.error || 'Er is een fout opgetreden bij het ophalen van data');
      }
    } catch (err) {
      setError('Netwerkfout: Kan geen verbinding maken met de server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage, searchTerm);
  }, [currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchData(1, searchTerm);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/download/${sessionData.session_id}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = sessionData.filename.replace('.xml', '_output.xlsx');
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const result = await response.json();
        setError(result.error || 'Er is een fout opgetreden bij het downloaden');
      }
    } catch (err) {
      setError('Netwerkfout: Kan bestand niet downloaden');
    }
  };

  const formatValue = (value) => {
    if (value === null || value === undefined || value === '') {
      return '-';
    }
    return value.toString();
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={onBack}>
                  <ArrowLeft className="h-4 w-4" />
                  Terug
                </Button>
                Rittenadministratie Data
              </CardTitle>
              <CardDescription>
                Bestand: {sessionInfo.filename} | 
                Geüpload: {sessionInfo.upload_time ? new Date(sessionInfo.upload_time).toLocaleString('nl-NL') : ''} | 
                Totaal records: {sessionInfo.total_records}
              </CardDescription>
            </div>
            <Button onClick={handleDownload} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Excel
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Input
              placeholder="Zoek in alle velden..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              onClick={() => fetchData(currentPage, searchTerm)}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rit ID</TableHead>
                  <TableHead>Datum/Tijd</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Bestuurder</TableHead>
                  <TableHead>KM Begin</TableHead>
                  <TableHead>KM Eind</TableHead>
                  <TableHead>Prijs</TableHead>
                  <TableHead>Locatie Begin</TableHead>
                  <TableHead>Locatie Eind</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                      Laden...
                    </TableCell>
                  </TableRow>
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      Geen data gevonden
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((rit, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {formatValue(rit.rit_id)}
                      </TableCell>
                      <TableCell>
                        {formatValue(rit.datum_tijd_registratie)}
                      </TableCell>
                      <TableCell>
                        {rit.type && (
                          <Badge variant="outline">
                            {formatValue(rit.type)}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {formatValue(rit.bestuurder_id)}
                      </TableCell>
                      <TableCell>
                        {formatValue(rit.km_stand_begin)}
                      </TableCell>
                      <TableCell>
                        {formatValue(rit.km_stand_eind)}
                      </TableCell>
                      <TableCell>
                        {rit.prijs && `€${formatValue(rit.prijs)}`}
                      </TableCell>
                      <TableCell>
                        {rit.latitude_begin && rit.longitude_begin ? (
                          <span className="text-sm">
                            {formatValue(rit.latitude_begin)}, {formatValue(rit.longitude_begin)}
                          </span>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        {rit.latitude_eind && rit.longitude_eind ? (
                          <span className="text-sm">
                            {formatValue(rit.latitude_eind)}, {formatValue(rit.longitude_eind)}
                          </span>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Pagina {pagination.page} van {pagination.pages} 
                ({pagination.total} totaal records)
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage <= 1 || loading}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Vorige
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage >= pagination.pages || loading}
                >
                  Volgende
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DataViewer;

