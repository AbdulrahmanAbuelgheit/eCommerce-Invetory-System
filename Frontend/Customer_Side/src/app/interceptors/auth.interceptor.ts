import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  //Retrieve the token from storage (e.g., localStorage)
  const token = localStorage.getItem('authToken');
  // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2N2IzNjQzM2NhOGUxMjY4NDljNWRiMjQiLCJlbWFpbCI6ImhvYnpAZ21haWwuY29tIiwidXNlclR5cGUiOiJjdXN0b21lciIsImlhdCI6MTc0MDA1Njg2OSwiZXhwIjoxNzQwMTQzMjY5fQ.d_jnAICXM0iL7tXuKP5zxrQQvhCQhmngmYMgs4x-KJ4" // Replace with your token key
  console.log('Token:', token);

  // Clone the request and add the token to the headers
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(clonedRequest);
  }

  // If no token, proceed with the original request
  return next(req);
};