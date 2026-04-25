import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '@/components/common/Button';
import { RotateCcw } from 'lucide-react';

interface SignaturePadProps {
  onSave: (signatureUrl: string) => void;
  onClear?: () => void;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ onSave, onClear }) => {
  const sigCanvas = useRef<SignatureCanvas>(null);

  const clear = () => {
    sigCanvas.current?.clear();
    if (onClear) onClear();
  };

  const save = () => {
    if (sigCanvas.current?.isEmpty()) return;
    const dataUrl = sigCanvas.current?.getTrimmedCanvas().toDataURL('image/png');
    if (dataUrl) {
      onSave(dataUrl);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden">
        <SignatureCanvas
          ref={sigCanvas}
          penColor="black"
          canvasProps={{
            className: "w-full h-40 cursor-crosshair",
          }}
        />
      </div>
      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={clear}
          className="rounded-xl flex items-center gap-2"
        >
          <RotateCcw size={14} /> Clear
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={save}
          className="rounded-xl bg-primary text-white"
        >
          Use Signature
        </Button>
      </div>
    </div>
  );
};

export default SignaturePad;
