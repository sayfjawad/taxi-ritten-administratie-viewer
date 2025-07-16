import { useState } from 'react'
import FileUpload from './components/FileUpload'
import DataViewer from './components/DataViewer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Database } from 'lucide-react'
import './App.css'

function App() {
  const [sessionData, setSessionData] = useState(null)
  const [currentView, setCurrentView] = useState('upload')

  const handleUploadSuccess = (data) => {
    setSessionData(data)
    setCurrentView('viewer')
  }

  const handleBackToUpload = () => {
    setCurrentView('upload')
    setSessionData(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <FileText className="h-10 w-10 text-blue-600" />
            Rittenadministratie Converter
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload uw XML rittenadministratie bestanden en bekijk de data online. 
            Converteer eenvoudig naar Excel formaat.
          </p>
        </div>

        {/* Main Content */}
        {currentView === 'upload' ? (
          <div className="space-y-8">
            <FileUpload onUploadSuccess={handleUploadSuccess} />
            
            {/* Info Cards */}
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Ondersteunde Bestanden
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• XML bestanden van rittenadministratie</li>
                    <li>• Automatische parsing van rit gegevens</li>
                    <li>• Ondersteuning voor locatie data</li>
                    <li>• Bestuurder en kilometerstand informatie</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-green-600" />
                    Functionaliteiten
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Online data viewer met zoekfunctie</li>
                    <li>• Paginering voor grote datasets</li>
                    <li>• Export naar Excel (.xlsx) formaat</li>
                    <li>• Responsive design voor alle apparaten</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <DataViewer 
            sessionData={sessionData} 
            onBack={handleBackToUpload}
          />
        )}
      </div>
    </div>
  )
}

export default App
