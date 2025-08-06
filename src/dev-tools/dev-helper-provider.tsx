'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSpacebarTriple } from './use-spacebar-triple';
import { DevHelperModal } from './dev-helper-modal';

type TDevHelperContext = {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  handleLoginRedirect: () => void;
  handleAutofill: () => void;
};

type TProps = {
  children: React.ReactNode;
};

const DevHelperContext = createContext<TDevHelperContext | null>(null);

export function DevHelperProvider({ children }: TProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isTriggered, resetTriggered } = useSpacebarTriple();
  const router = useRouter();

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function handleLoginRedirect() {
    router.push('/-login');
  }

  function handleAutofill() {
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
    
    inputs.forEach(function(input) {
      if (input instanceof HTMLInputElement) {
        const inputType = input.type.toLowerCase();
        const inputName = input.name?.toLowerCase() || '';
        const inputId = input.id?.toLowerCase() || '';
        
        if (inputType === 'email' || inputName.includes('email') || inputId.includes('email')) {
          input.value = 'dev@example.com';
        } else if (inputType === 'password' || inputName.includes('password') || inputId.includes('password')) {
          input.value = 'devpass123';
        } else if (inputName.includes('name') || inputId.includes('name')) {
          input.value = 'Dev User';
        } else if (inputName.includes('username') || inputId.includes('username')) {
          input.value = 'devuser';
        } else {
          input.value = 'dev-value';
        }
        
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  }

  useEffect(function() {
    if (isTriggered) {
      openModal();
      resetTriggered();
    }
  }, [isTriggered, resetTriggered]);

  const contextValue: TDevHelperContext = {
    isModalOpen,
    openModal,
    closeModal,
    handleLoginRedirect,
    handleAutofill,
  };

  return (
    <DevHelperContext.Provider value={contextValue}>
      {children}
      <DevHelperModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onLoginRedirect={handleLoginRedirect}
        onAutofill={handleAutofill}
      />
    </DevHelperContext.Provider>
  );
}

export function useDevHelper() {
  const context = useContext(DevHelperContext);
  if (!context) {
    throw new Error('useDevHelper must be used within a DevHelperProvider');
  }
  return context;
}
