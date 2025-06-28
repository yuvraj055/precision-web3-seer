
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Shield, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { ContractData } from "@/pages/Index";

interface AuditDashboardProps {
  contracts: ContractData[];
  onSelectContract: (contract: ContractData) => void;
}

export const AuditDashboard = ({ contracts, onSelectContract }: AuditDashboardProps) => {
  const totalContracts = contracts.length;
  const criticalIssues = contracts.reduce((sum, contract) => 
    sum + contract.auditResults.filter(r => r.severity === 'critical').length, 0
  );
  const highIssues = contracts.reduce((sum, contract) => 
    sum + contract.auditResults.filter(r => r.severity === 'high').length, 0
  );
  const totalIssues = contracts.reduce((sum, contract) => sum + contract.auditResults.length, 0);

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contracts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalContracts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalIssues}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Issues</CardTitle>
            <Shield className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{highIssues}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalIssues}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Audits */}
      {contracts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Audits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contracts.map((contract, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => onSelectContract(contract)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{contract.name}</h4>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{contract.uploadedAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {contract.auditResults.length > 0 ? (
                      <>
                        {contract.auditResults.some(r => r.severity === 'critical') && (
                          <Badge variant="destructive">Critical</Badge>
                        )}
                        {contract.auditResults.some(r => r.severity === 'high') && (
                          <Badge className="bg-orange-500 hover:bg-orange-600">High</Badge>
                        )}
                        <Badge variant="secondary">
                          {contract.auditResults.length} issues
                        </Badge>
                      </>
                    ) : (
                      <Badge variant="outline">Analyzing...</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
