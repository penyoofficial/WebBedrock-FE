import { useUserStore } from "@/stores/user";
import type { Neko } from "@/types/Neko";
import type { User } from "@/types/User";

const addr = "http://localhost:24681";

export namespace Request {
  async function $<T>(
    method: "POST" | "DELETE" | "PUT" | "GET",
    path: string,
    headerAuth: string = useUserStore().token,
    pathVar: string[] = [],
    body: any = null,
  ) {
    const resp = await fetch(
      `${addr}${path}${pathVar.length ? "/" : ""}${pathVar.join("/")}`,
      {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: headerAuth,
        },
        body: method == "GET" ? null : JSON.stringify(body),
      },
    );
    const obj = (await resp.json()) as {
      msg: string;
      data: T;
    };

    return {
      code: resp.status,
      ok: resp.ok,
      msg: obj.msg,
      data: obj.data,
    };
  }

  export namespace User {
    export function register(loginName: string, password: string) {
      return $<null>("POST", "/user", password, [loginName]);
    }

    export function login(loginName: string, password: string) {
      return $<string>("GET", "/user", password, [loginName]);
    }

    export function getMe() {
      return $<User[]>("GET", "/user/me");
    }

    export function getAll() {
      return $<User[]>("POST", "/user/su/q");
    }
  }

  export namespace Neko {
    export function getAll() {
      return $<Neko[]>("POST", "/neko/q");
    }
  }
}
