
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { ContractData } from "@/pages/Index";

interface CodeViewerProps {
  contract: ContractData;
  isAuditing: boolean;
}

export const CodeViewer = ({ contract, isAuditing }: CodeViewerProps) => {
  const [selectedLine, setSelectedLine] = useState<number | null>(null);

  const getLineIssues = (lineNumber: number) => {
    return contract.auditResults.filter(result => result.lineNumber === lineNumber);
  };

  const renderCodeLine = (line: string, lineNumber: number) => {
    const issues = getLineIssues(lineNumber);
    const hasIssues = issues.length > 0;
    const criticalIssue = issues.find(i => i.severity === 'critical');
    const highIssue = issues.find(i => i.severity === 'high');

    return (
      <div
        key={lineNumber}
        className={`flex items-start space-x-4 px-4 py-1 hover:bg-muted/50 cursor-pointer ${
          hasIssues ? 'bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500' : ''
        } ${selectedLine === lineNumber ? 'bg-blue-50 dark:bg-blue-950/20' : ''}`}
        onClick={() => setSelectedLine(selectedLine === lineNumber ? null : lineNumber)}
      >
        <div className="flex items-center space-x-2 min-w-16">
          <span className="text-sm text-muted-foreground w-8 text-right">
            {lineNumber}
          </span>
          {hasIssues && (
            <AlertCircle className={`h-3 w-3 ${
              criticalIssue ? 'text-red-500' : 
              highIssue ? 'text-orange-500' : 'text-yellow-500'
            }`} />
          )}
        </div>
        <code className="text-sm font-mono flex-1">{line}</code>
      </div>
    );
  };

  const selectedLineIssues = selectedLine ? getLineIssues(selectedLine) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <span>Code Analysis</span>
                {isAuditing && <Loader2 className="h-4 w-4 animate-spin" />}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{contract.name}</Badge>
                <Badge variant="secondary">
                  {Math.round(contract.size / 1024)} KB
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isAuditing ? (
              <div className="flex items-center justify-center p-12">
                <div className="text-center space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
                  <p className="text-lg font-medium">Analyzing Contract...</p>
                  <p className="text-muted-foreground">
                    Running comprehensive security checks
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-muted/20 rounded-lg overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                  {contract.content.split('\n').map((line, index) => 
                    renderCodeLine(line, index + 1)
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Issue Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedLine ? (
              selectedLineIssues.length > 0 ? (
                <div className="space-y-4">
                  {selectedLineIssues.map((issue) => (
                    <div key={issue.id} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge className={
                          issue.severity === 'critical' ? 'bg-red-500 hover:bg-red-600' :
                          issue.severity === 'high' ? 'bg-orange-500 hover:bg-orange-600' :
                          issue.severity === 'medium' ? 'bg-yellow-500 hover:bg-yellow-600' :
                          'bg-blue-500 hover:bg-blue-600'
                        }>
                          {issue.severity.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {issue.category}
                        </span>
                      </div>
                      <h4 className="font-medium">{issue.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {issue.description}
                      </p>
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded border-l-4 border-blue-500">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                          Suggestion:
                        </p>
                        <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                          {issue.suggestion}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">No issues found on this line</span>
                </div>
              )
            ) : (
              <p className="text-muted-foreground text-sm">
                Click on a line number to view detailed analysis
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
