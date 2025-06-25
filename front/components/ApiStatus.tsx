"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { apiService } from '@/lib/api';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export default function ApiStatus() {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkApiStatus = async () => {
    setStatus('loading');
    setMessage('Vérification de la connexion...');
    
    try {
      const result = await apiService.testConnection();
      
      if (result.error) {
        setStatus('error');
        setMessage(`Erreur de connexion: ${result.error}`);
      } else {
        setStatus('connected');
        setMessage(result.data?.message || 'Connexion établie');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Impossible de se connecter au backend');
    }
    
    setLastCheck(new Date());
  };

  useEffect(() => {
    checkApiStatus();
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <RefreshCw className="h-4 w-4 text-yellow-500 animate-spin" />;
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'connected':
        return <Badge variant="default" className="bg-green-500">Connecté</Badge>;
      case 'error':
        return <Badge variant="destructive">Erreur</Badge>;
      default:
        return <Badge variant="secondary">Vérification...</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          Statut API Backend
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Statut:</span>
          {getStatusBadge()}
        </div>
        
        <div className="text-sm">
          <p className="text-muted-foreground mb-1">Message:</p>
          <p className="font-mono text-xs bg-muted p-2 rounded">
            {message}
          </p>
        </div>
        
        {lastCheck && (
          <div className="text-xs text-muted-foreground">
            Dernière vérification: {lastCheck.toLocaleTimeString()}
          </div>
        )}
        
        <Button 
          onClick={checkApiStatus} 
          variant="outline" 
          size="sm"
          disabled={status === 'loading'}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Vérifier à nouveau
        </Button>
      </CardContent>
    </Card>
  );
} 