import { NextRequest, NextResponse } from "next/server";
import { middlewareCookieAuthCheck } from "./utilities/accessControl/middlewareCookieAuthCheck";
import { UserRole } from "../../backend/api/src/bll/user/types";

export const middleware = async (
  request: NextRequest
): Promise<NextResponse> => {
  try {
    if (request.nextUrl.pathname.startsWith("/panel")) {
      const role = await middlewareCookieAuthCheck(request);
      if (!role) {
        throw 401;
      }

      if (request.nextUrl.pathname.startsWith("/panel/admin")) {
        if (role === UserRole.ADMIN) {
          return NextResponse.next();
        } else {
          throw 401;
        }
      }

      if (request.nextUrl.pathname.startsWith("/panel/aula")) {
        if (role === UserRole.STUDENT) {
          return NextResponse.next();
        } else {
          throw 401;
        }
      }

      if (request.nextUrl.pathname.startsWith("/panel/escuela")) {
        if (role === UserRole.TEACHER) {
          return NextResponse.next();
        } else {
          throw 401;
        }
      }
    }

    return NextResponse.next();
  } catch (e: any) {
    const redirectUrl = new URL("/login", request.url);
    return NextResponse.redirect(redirectUrl);
  }
};
