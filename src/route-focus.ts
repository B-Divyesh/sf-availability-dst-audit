function headingForRoute() {
  const targetId = decodeURIComponent(location.hash.slice(1));
  const target = targetId ? document.getElementById(targetId) : null;
  if (target instanceof HTMLElement) {
    if (/^H[1-6]$/.test(target.tagName)) return target;
    return target.querySelector<HTMLElement>('h1, h2, h3') ?? target;
  }
  return document.querySelector<HTMLElement>('main h1');
}

function announceRoute() {
  const heading = headingForRoute();
  if (!heading) return;
  heading.setAttribute('tabindex', '-1');
  heading.focus({ preventScroll: true });
  let region = document.querySelector<HTMLElement>('#route-announcement');
  if (!region) {
    region = document.createElement('div');
    region.id = 'route-announcement';
    region.className = 'sr-only';
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    document.body.append(region);
  }
  region.textContent = heading.textContent?.trim() ?? document.title;
}

window.addEventListener('DOMContentLoaded', () => requestAnimationFrame(announceRoute));
window.addEventListener('pageshow', () => requestAnimationFrame(announceRoute));
window.addEventListener('popstate', () => requestAnimationFrame(announceRoute));
window.addEventListener('hashchange', () => requestAnimationFrame(announceRoute));
