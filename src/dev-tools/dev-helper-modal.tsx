import * as Dialog from '@radix-ui/react-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDevHelper } from './dev-helper-provider';

type TProps = {
  isOpen: boolean;
  onClose: () => void;
  onLoginRedirect: () => void;
  onAutofill: () => void;
};

export function DevHelperModal({ isOpen, onClose, onLoginRedirect, onAutofill }: TProps) {
  const { handleLoginRedirect, handleAutofill } = useDevHelper();

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg p-4">
          <Card>
            <CardHeader>
              <CardTitle>Dev Helper</CardTitle>
              <CardDescription>
                This is a helper for development purposes.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <button onClick={handleLoginRedirect} className="bg-blue-500 text-white p-2 rounded-md">
                Go to Login
              </button>
              <button onClick={handleAutofill} className="bg-green-500 text-white p-2 rounded-md">
                Autofill Forms
              </button>
            </CardContent>
          </Card>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}