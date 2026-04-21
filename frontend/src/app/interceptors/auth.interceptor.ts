import { HttpInterceptorFn } from '@angular/common/http';

const PUBLIC_URLS = ['/api/login/', '/api/token/refresh/'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const isPublic = PUBLIC_URLS.some(url => req.url.includes(url));
  if (isPublic) return next(req);

  const token = localStorage.getItem('access_token');
  if (!token) return next(req);

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq);
};