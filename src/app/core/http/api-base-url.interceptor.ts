import { HttpInterceptorFn } from '@angular/common/http';

const API_BASE_URL = 'http://localhost:3000';

export const apiBaseUrlInterceptor: HttpInterceptorFn = (request, next) => {
  if (/^https?:\/\//.test(request.url)) {
    return next(request);
  }

  const url = request.url.startsWith('/') ? request.url : `/${request.url}`;

  return next(
    request.clone({
      url: `${API_BASE_URL}${url}`,
    }),
  );
};
