import { HttpInterceptorFn } from '@angular/common/http';

import { API_BASE_URL } from '../config/api.config';

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
