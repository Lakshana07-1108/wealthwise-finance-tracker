
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2, CheckCircle, AlertCircle, XCircle, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { extractReceiptDetails, ExtractReceiptDetailsOutput } from "@/ai/flows/extract-receipt-details";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useUser } from "@/hooks/use-auth";
import type { Transaction, Category } from "@/lib/types";


export default function ScanReceiptPage() {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = React.useState<boolean | null>(null);
  const [isScanning, setIsScanning] = React.useState(false);
  const [scannedData, setScannedData] = React.useState<ExtractReceiptDetailsOutput | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const user = useUser();


  React.useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        console.error("Camera API is not supported in this browser.");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this feature.',
        });
      }
    };

    if(scannedData === null && error === null){
      getCameraPermission();
    }
    
    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [toast, scannedData, error]);

  const scanImageData = async (imageDataUri: string) => {
    setIsScanning(true);
    setError(null);
    setScannedData(null);

    try {
      const result = await extractReceiptDetails({ imageDataUri });
      if (!result.name || !result.amount || !result.date) {
        throw new Error("Could not extract all details from the receipt.");
      }
      setScannedData(result);
    } catch (e) {
      console.error(e);
      setError("Failed to scan receipt. The image might be blurry or unclear. Please try again.");
    } finally {
      setIsScanning(false);
    }
  };

  const captureAndScan = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    if(!context) return;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataUri = canvas.toDataURL("image/jpeg");
    scanImageData(imageDataUri);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUri = e.target?.result as string;
        scanImageData(imageDataUri);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  }
  
  const handleSaveTransaction = async () => {
    if (!scannedData || !user) return;
    
    const newTransaction: Omit<Transaction, 'id'> = {
        name: scannedData.name,
        amount: scannedData.amount,
        date: new Date(scannedData.date).toISOString(),
        category: scannedData.category as Category,
        type: 'expense',
        source: 'scan',
    }
    
    try {
        await addDoc(collection(db, `users/${user.uid}/transactions`), newTransaction);
        toast({
            title: "Transaction Saved",
            description: "The scanned transaction has been added to your records.",
        });
        router.push("/dashboard/transactions");
    } catch(e) {
        console.error(e)
        toast({
            variant: "destructive",
            title: "Save Failed",
            description: "Could not save the transaction. Please try again.",
        });
    }
  }

  const handleRetry = () => {
    setScannedData(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Scan Receipt</h1>
        <p className="text-muted-foreground">
          Capture or upload a receipt to automatically add a transaction.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="aspect-video w-full bg-muted rounded-md overflow-hidden relative flex items-center justify-center">
            {scannedData === null && error === null && <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />}
            <canvas ref={canvasRef} className="hidden" />
             {hasCameraPermission === false && scannedData === null && (
                <div className="absolute flex flex-col items-center text-center text-muted-foreground p-4">
                    <XCircle className="w-16 h-16 text-destructive mb-4" />
                    <h3 className="text-lg font-semibold">Camera Access Denied</h3>
                    <p>You can still upload a receipt image.</p>
                </div>
            )}
             {hasCameraPermission === null && scannedData === null && (
                <div className="absolute flex flex-col items-center text-center text-muted-foreground">
                    <Loader2 className="w-16 h-16 animate-spin mb-4" />
                    <h3 className="text-lg font-semibold">Requesting Camera...</h3>
                </div>
            )}
            {scannedData && (
                <div className="text-center p-4">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">Scan Successful!</h3>
                </div>
            )}
            {error && (
                 <div className="text-center p-4">
                    <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">Scan Failed</h3>
                </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-4 p-6">
           {!scannedData && (
             <div className="w-full flex flex-col sm:flex-row gap-4">
                 <Button
                    onClick={captureAndScan}
                    disabled={isScanning || hasCameraPermission !== true}
                    className="w-full"
                    size="lg"
                  >
                    {isScanning ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <Camera className="mr-2 h-5 w-5" />
                    )}
                    {isScanning ? "Scanning..." : "Scan with Camera"}
                  </Button>
                   <Button
                    onClick={handleUploadClick}
                    disabled={isScanning}
                    variant="secondary"
                    className="w-full"
                    size="lg"
                  >
                    <Upload className="mr-2 h-5 w-5" />
                    Upload Receipt
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
             </div>
           )}

            {error && (
            <Alert variant="destructive" className="w-full">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Scan Failed</AlertTitle>
                <AlertDescription>
                {error}
                <Button variant="link" onClick={handleRetry} className="p-0 h-auto ml-2">Try Again</Button>
                </AlertDescription>
            </Alert>
            )}

            {scannedData && (
                <div className="w-full space-y-6">
                    <Alert variant="default" className="w-full bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <AlertTitle className="text-green-800 dark:text-green-300">Scan Successful!</AlertTitle>
                        <AlertDescription className="text-green-700 dark:text-green-400">
                        Review the details below and save the transaction.
                        </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-6 text-sm">
                        <div>
                            <p className="font-medium text-muted-foreground">Vendor</p>
                            <p className="font-semibold text-lg">{scannedData.name}</p>
                        </div>
                         <div className="text-right">
                            <p className="font-medium text-muted-foreground">Amount</p>
                            <p className="font-semibold text-lg">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(scannedData.amount)}</p>
                        </div>
                         <div>
                            <p className="font-medium text-muted-foreground">Date</p>
                            <p className="font-semibold">{new Date(scannedData.date).toLocaleDateString()}</p>
                        </div>
                         <div className="text-right">
                            <p className="font-medium text-muted-foreground">Category</p>
                            <p className="font-semibold">{scannedData.category}</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                         <Button onClick={handleRetry} variant="outline" className="w-full">
                            Scan or Upload Another
                        </Button>
                        <Button onClick={handleSaveTransaction} className="w-full">
                            Save Transaction
                        </Button>
                    </div>
                </div>
            )}
        </CardFooter>
      </Card>
    </div>
  );
}
