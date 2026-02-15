import { HttpInterceptorFn } from '@angular/common/http';

// שים לב למילה export בתחילת השורה - זה מה שמאפשר ל-app.config לייבא אותו
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenData = localStorage.getItem('token');
  let token = '';

  if (tokenData) {
    try {
      const parsedData = JSON.parse(tokenData);
      token = parsedData.token;
    } catch (e) {
      console.error('Error parsing token from localStorage', e);
    }
  }

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  return next(req);
};