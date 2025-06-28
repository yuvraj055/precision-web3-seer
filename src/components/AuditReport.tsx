
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield, Info, Download, Loader2 } from "lucide-react";
import { AuditResult } from "@/pages/Index";

interface AuditReportProps {
  auditResults: AuditResult[];
  isLoading: boolean;
}

export const AuditReport = ({ auditResults, isLoading }: AuditReportProps) => {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      case 'medium':
        return <Shield className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800';
    }
  };

  const criticalIssues = auditResults.filter(r => r.severity === 'critical');
  const highIssues = auditResults.filter(r => r.severity === 'high');
  const mediumIssues = auditResults.filter(r => r.severity === 'medium');
  const lowIssues = auditResults.filter(r => r.severity === 'low' || r.severity === 'info');

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-12">
          <div className="flex items-center justify-center space-x-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <div className="text-center">
              <p className="text-lg font-medium">Generating Audit Report...</p>
              <p className="text-muted-foreground">This may take a few moments</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Audit Summary</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{criticalIssues.length}</div>
              <div className="text-sm text-red-600">Critical</div>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{highIssues.length}</div>
              <div className="text-sm text-orange-600">High</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{mediumIssues.length}</div>
              <div className="text-sm text-yellow-600">Medium</div>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{lowIssues.length}</div>
              <div className="text-sm text-blue-600">Low</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Issues List */}
      <div className="space-y-4">
        {auditResults.map((result) => (
          <Card key={result.id} className={`border-l-4 ${getSeverityColor(result.severity)}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {getSeverityIcon(result.severity)}
                  <div>
                    <h3 className="font-semibold">{result.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={
                        result.severity === 'critical' ? 'bg-red-500 hover:bg-red-600' :
                        result.severity === 'high' ? 'bg-orange-500 hover:bg-orange-600' :
                        result.severity === 'medium' ? 'bg-yellow-500 hover:bg-yellow-600' :
                        'bg-blue-500 hover:bg-blue-600'
                      }>
                        {result.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">{result.category}</Badge>
                      <span className="text-sm text-muted-foreground">Line {result.lineNumber}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Description</h4>
                  <p className="text-muted-foreground">{result.description}</p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-medium text-sm mb-2 text-blue-900 dark:text-blue-100">
                    Recommended Solution
                  </h4>
                  <p className="text-blue-800 dark:text-blue-200 text-sm">{result.suggestion}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {auditResults.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-600 mb-2">
              No Issues Found!
            </h3>
            <p className="text-muted-foreground">
              Your smart contract appears to be secure based on our analysis.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
