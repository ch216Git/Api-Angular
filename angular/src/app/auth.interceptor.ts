import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // שולפים את הטוקן כמחרוזת פשוטה
  const token = localStorage.getItem('token');

  // אם הטוקן קיים, מוסיפים אותו ל-Header
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  // אם אין טוקן, ממשיכים בבקשה המקורית
  return next(req);
};