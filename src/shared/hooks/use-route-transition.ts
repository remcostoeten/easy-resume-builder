import { useEffect } from 'react';
import Router from 'next/router';
import { useRouter } from 'next/navigation';
import { start } from '../utilities/view-transition';

function isAuthPath(pathname: string): boolean {
  return pathname === '/login' || pathname === '/register';
}

function setAuthPageVT() {
  if (typeof document === 'undefined') {
    return;
  }
  const el = document.body as unknown as { style: Partial<CSSStyleDeclaration> } & HTMLElement;
  el.dataset.vt = 'auth-page';
  try {
    (el.style as any).viewTransitionName = 'auth-page';
  } catch {}
}

function isModifiedEvent(event: MouseEvent): boolean {
  return (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  );
}

function handleLinkClicks(push: (href: string) => void) {
  return function onClick(event: MouseEvent) {
    const target = event.target as HTMLElement | null;
    if (!target) {
      return;
    }
    const anchor = target.closest('a');
    if (!anchor) {
      return;
    }
    const href = anchor.getAttribute('href') || '';
    if (!href) {
      return;
    }
    if (isModifiedEvent(event)) {
      return;
    }
    if (anchor.target && anchor.target !== '_self') {
      return;
    }
    try {
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) {
        return;
      }
      event.preventDefault();
      if (isAuthPath(url.pathname)) {
        setAuthPageVT();
      }
      void start(function run() {
        push(url.pathname + url.search + url.hash);
      });
    } catch {}
  };
}

export function useRouteTransition(): void {
  const router = useRouter();

  useEffect(function subscribeRouterEvents() {
    function onStart(url: string) {
      try {
        const next = new URL(url, window.location.origin);
        if (isAuthPath(next.pathname)) {
          setAuthPageVT();
        }
      } catch {}
      void start(function run() {});
    }
    Router.events.on('routeChangeStart', onStart);
    return function cleanup() {
      Router.events.off('routeChangeStart', onStart);
    };
  }, []);

  useEffect(function attachClickDelegation() {
    function push(href: string) {
      router.push(href);
    }
    const handler = handleLinkClicks(push);
    document.addEventListener('click', handler, true);
    return function cleanup() {
      document.removeEventListener('click', handler, true);
    };
  }, [router]);
}
