// import { defineMiddleware } from 'astro/middleware';
// import { parse } from 'cookie';

// export const onRequest = defineMiddleware(async (context, next) => {
//     console.log("onRequest called!");
//     const cookieHeader = context.request.headers.get('cookie') || '';
//     const cookies = parse(cookieHeader);
//     const authCookie = cookies['auth_token'];

//     let isAuthenticated = false;

//     if (authCookie) {
//         const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/breeds', {
//             method: 'GET',
//             credentials: 'include',
//         });

//         if (response.ok) {
//             isAuthenticated = true;
//         }
//     }

//     context.locals.isAuthenticated = isAuthenticated;
//     console.log("isAuthenticated:", isAuthenticated);
//     console.log("context.locals.isAuthenticated:", context.locals.isAuthenticated);
//     return await next();
// });