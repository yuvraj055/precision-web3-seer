
import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { AuditDashboard } from "@/components/AuditDashboard";
import { CodeViewer } from "@/components/CodeViewer";
import { AuditReport } from "@/components/AuditReport";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface AuditResult {
  id: string;
  contractName: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  description: string;
  lineNumber: number;
  suggestion: string;
  category: string;
}

export interface ContractData {
  name: string;
  content: string;
  size: number;
  uploadedAt: Date;
  auditResults: AuditResult[];
}

const Index = () => {
  const [contracts, setContracts] = useState<ContractData[]>([]);
  const [selectedContract, setSelectedContract] = useState<ContractData | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const handleFileUpload = async (file: File) => {
    const content = await file.text();
    const newContract: ContractData = {
      name: file.name,
      content,
      size: file.size,
      uploadedAt: new Date(),
      auditResults: []
    };
    
    setContracts(prev => [...prev, newContract]);
    setSelectedContract(newContract);
    
    // Simulate audit process
    setIsAuditing(true);
    setTimeout(() => {
      const mockResults = generateMockAuditResults(file.name);
      newContract.auditResults = mockResults;
      setContracts(prev => prev.map(c => c.name === newContract.name ? newContract : c));
      setIsAuditing(false);
    }, 3000);
  };

  const generateMockAuditResults = (contractName: string): AuditResult[] => {
    return [
      {
        id: '1',
        contractName,
        severity: 'critical',
        title: 'Reentrancy Vulnerability',
        description: 'External call made before state changes, potential for reentrancy attack.',
        lineNumber: 42,
        suggestion: 'Use checks-effects-interactions pattern or reentrancy guard.',
        category: 'Security'
      },
      {
        id: '2',
        contractName,
        severity: 'high',
        title: 'Integer Overflow Risk',
        description: 'Arithmetic operations without SafeMath library may cause overflow.',
        lineNumber: 67,
        suggestion: 'Implement SafeMath library or use Solidity ^0.8.0 built-in overflow protection.',
        category: 'Security'
      },
      {
        id: '3',
        contractName,
        severity: 'medium',
        title: 'Gas Optimization',
        description: 'Loop operations can be optimized to reduce gas consumption.',
        lineNumber: 89,
        suggestion: 'Consider batch operations or pagination for large datasets.',
        category: 'Gas Optimization'
      },
      {
        id: '4',
        contractName,
        severity: 'low',
        title: 'Code Style',
        description: 'Function visibility can be more explicit.',
        lineNumber: 23,
        suggestion: 'Explicitly declare function visibility (public, private, internal, external).',
        category: 'Best Practices'
      }
    ];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Header />
      
      <div className="container mx-auto p-6 space-y-6">
        {!selectedContract ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Web3 Smart Contract Auditor
              </h1>
              <p className="text-xl text-muted-foreground">
                Advanced security analysis for your Solidity smart contracts
              </p>
            </div>
            
            <AuditDashboard contracts={contracts} onSelectContract={setSelectedContract} />
            
            <Card className="p-8 mt-8">
              <FileUpload onFileUpload={handleFileUpload} />
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{selectedContract.name}</h2>
              <button
                onClick={() => setSelectedContract(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
            
            <Tabs defaultValue="code" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="code">Code Analysis</TabsTrigger>
                <TabsTrigger value="report">Audit Report</TabsTrigger>
                <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="code" className="space-y-4">
                <CodeViewer 
                  contract={selectedContract} 
                  isAuditing={isAuditing}
                />
              </TabsContent>
              
              <TabsContent value="report" className="space-y-4">
                <AuditReport 
                  auditResults={selectedContract.auditResults}
                  isLoading={isAuditing}
                />
              </TabsContent>
              
              <TabsContent value="suggestions" className="space-y-4">
                <div className="grid gap-4">
                  {selectedContract.auditResults.map((result) => (
                    <Card key={result.id} className="p-6">
                      <h3 className="font-semibold text-lg mb-2">{result.title}</h3>
                      <p className="text-muted-foreground mb-4">{result.suggestion}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <span className={`px-2 py-1 rounded text-white ${
                          result.severity === 'critical' ? 'bg-red-500' :
                          result.severity === 'high' ? 'bg-orange-500' :
                          result.severity === 'medium' ? 'bg-yellow-500' :
                          'bg-blue-500'
                        }`}>
                          {result.severity.toUpperCase()}
                        </span>
                        <span className="text-muted-foreground">Line {result.lineNumber}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
