var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-y3Xynt/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// .wrangler/tmp/pages-JXC48O/bundledWorker-0.6662444765743949.mjs
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
var urls2 = /* @__PURE__ */ new Set();
function checkURL2(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls2.has(url.toString())) {
      urls2.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL2, "checkURL");
__name2(checkURL2, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL2(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});
var worker_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Max-Age": "86400"
        }
      });
    }
    if (url.pathname === "/api/contact" && request.method === "POST") {
      return handleContactAPI(request, env);
    }
    if (url.pathname === "/api/upload-image" && request.method === "POST") {
      return handleImageUpload(request, env);
    }
    if (url.pathname === "/api/admin/login" && request.method === "POST") {
      return handleAdminLogin(request, env);
    }
    if (url.pathname === "/api/admin/contacts" && request.method === "GET") {
      return handleGetContacts(request, env);
    }
    if (url.pathname.startsWith("/api/")) {
      return handleAPIProxy(request, env);
    }
    return env.ASSETS.fetch(request);
  }
};
async function handleContactAPI(request, env) {
  try {
    const body = await request.json();
    if (!body || !body.data) {
      return new Response(JSON.stringify({
        code: 400,
        message: "\u8BF7\u6C42\u683C\u5F0F\u9519\u8BEF"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    const data = body.data;
    if (!data.name || !data.email || !data.message) {
      return new Response(JSON.stringify({
        code: 400,
        message: "\u8BF7\u586B\u5199\u6240\u6709\u5FC5\u586B\u5B57\u6BB5"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return new Response(JSON.stringify({
        code: 400,
        message: "\u90AE\u7BB1\u683C\u5F0F\u4E0D\u6B63\u786E"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    const spamKeywords = [
      "viagra",
      "casino",
      "lottery",
      "winner",
      "click here",
      "free money",
      "urgent",
      "congratulations",
      "million dollars",
      "bitcoin"
    ];
    const content = `${data.name} ${data.message}`.toLowerCase();
    const isSpam = spamKeywords.some((keyword) => content.includes(keyword));
    if (isSpam) {
      return new Response(JSON.stringify({
        code: 400,
        message: "\u68C0\u6D4B\u5230\u53EF\u7591\u5185\u5BB9\uFF0C\u8BF7\u91CD\u65B0\u586B\u5199"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    if (data.message.length < 10) {
      return new Response(JSON.stringify({
        code: 400,
        message: "\u6D88\u606F\u5185\u5BB9\u592A\u77ED\uFF0C\u8BF7\u63D0\u4F9B\u66F4\u591A\u4FE1\u606F"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    if (!env.DB) {
      return new Response(JSON.stringify({
        code: 500,
        message: "D1\u6570\u636E\u5E93\u672A\u914D\u7F6E\uFF0C\u8BF7\u8054\u7CFB\u6280\u672F\u652F\u6301"
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    try {
      const result = await env.DB.prepare(`
        INSERT INTO contacts (name, email, phone, company, message, ip_address, user_agent)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(
        data.name.trim(),
        data.email.trim().toLowerCase(),
        data.phone?.trim() || "",
        data.company?.trim() || "",
        data.message.trim(),
        request.headers.get("cf-connecting-ip") || "unknown",
        request.headers.get("user-agent") || "unknown"
      ).run();
      console.log("\u2705 D1\u6570\u636E\u5E93\u5B58\u50A8\u6210\u529F:", result);
      await sendNotification(data, env);
      return new Response(JSON.stringify({
        code: 200,
        message: "\u6D88\u606F\u63D0\u4EA4\u6210\u529F\uFF0C\u6211\u4EEC\u5C06\u5C3D\u5FEB\u56DE\u590D\u60A8",
        data: {
          id: result.meta.last_row_id,
          submitted_at: (/* @__PURE__ */ new Date()).toISOString(),
          storage: "D1_DATABASE"
        }
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } catch (dbError) {
      console.error("D1\u6570\u636E\u5E93\u9519\u8BEF:", dbError);
      return new Response(JSON.stringify({
        code: 500,
        message: `\u6570\u636E\u5E93\u5B58\u50A8\u5931\u8D25: ${dbError.message}`
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  } catch (error) {
    console.error("\u8054\u7CFBAPI\u9519\u8BEF:", error);
    return new Response(JSON.stringify({
      code: 500,
      message: `\u670D\u52A1\u5668\u9519\u8BEF: ${error.message}`
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
__name(handleContactAPI, "handleContactAPI");
__name2(handleContactAPI, "handleContactAPI");
async function sendNotification(data, env) {
  try {
    console.log("\u65B0\u8054\u7CFB\u6D88\u606F:", {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message.substring(0, 100) + "..."
    });
    if (env.NOTIFICATION_WEBHOOK) {
      await fetch(env.NOTIFICATION_WEBHOOK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type: "contact_form",
          data,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        })
      });
    }
  } catch (error) {
    console.error("\u901A\u77E5\u53D1\u9001\u5931\u8D25:", error);
  }
}
__name(sendNotification, "sendNotification");
__name2(sendNotification, "sendNotification");
async function handleImageUpload(request, env) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder") || "products";
    if (!file) {
      return new Response(JSON.stringify({
        code: 400,
        message: "\u8BF7\u9009\u62E9\u8981\u4E0A\u4F20\u7684\u6587\u4EF6"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    if (file.size > 5 * 1024 * 1024) {
      return new Response(JSON.stringify({
        code: 400,
        message: "\u6587\u4EF6\u5927\u5C0F\u4E0D\u80FD\u8D85\u8FC75MB"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    const supportedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!supportedTypes.includes(file.type)) {
      return new Response(JSON.stringify({
        code: 400,
        message: "\u4E0D\u652F\u6301\u7684\u56FE\u7247\u683C\u5F0F"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const ext = file.name.split(".").pop().toLowerCase();
    const fileName = `${folder}/${timestamp}_${randomStr}.${ext}`;
    try {
      if (env.IMAGE_BUCKET) {
        await env.IMAGE_BUCKET.put(fileName, file);
        const imageUrl = `https://your-domain.com/images/${fileName}`;
        return new Response(JSON.stringify({
          code: 200,
          message: "\u56FE\u7247\u4E0A\u4F20\u6210\u529F",
          data: {
            original: imageUrl,
            large: imageUrl,
            medium: imageUrl,
            small: imageUrl,
            thumbnail: imageUrl,
            fullUrls: {
              original: imageUrl,
              large: imageUrl,
              medium: imageUrl,
              small: imageUrl,
              thumbnail: imageUrl
            }
          }
        }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      } else {
        const arrayBuffer = await file.arrayBuffer();
        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        const dataUrl = `data:${file.type};base64,${base64}`;
        return new Response(JSON.stringify({
          code: 200,
          message: "\u56FE\u7247\u5904\u7406\u6210\u529F\uFF08\u4E34\u65F6\u5B58\u50A8\uFF09",
          data: {
            original: dataUrl,
            large: dataUrl,
            medium: dataUrl,
            small: dataUrl,
            thumbnail: dataUrl,
            fullUrls: {
              original: dataUrl,
              large: dataUrl,
              medium: dataUrl,
              small: dataUrl,
              thumbnail: dataUrl
            }
          }
        }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      }
    } catch (uploadError) {
      throw new Error(`\u4E0A\u4F20\u5931\u8D25: ${uploadError.message}`);
    }
  } catch (error) {
    console.error("\u56FE\u7247\u4E0A\u4F20\u9519\u8BEF:", error);
    return new Response(JSON.stringify({
      code: 500,
      message: `\u56FE\u7247\u4E0A\u4F20\u5931\u8D25: ${error.message}`
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
__name(handleImageUpload, "handleImageUpload");
__name2(handleImageUpload, "handleImageUpload");
async function handleAdminLogin(request, env) {
  try {
    const body = await request.json();
    const { email, password } = body;
    if (!email || !password) {
      return new Response(JSON.stringify({
        error: { message: "\u8BF7\u586B\u5199\u90AE\u7BB1\u548C\u5BC6\u7801" }
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    if (!env.DB) {
      return new Response(JSON.stringify({
        error: { message: "D1\u6570\u636E\u5E93\u672A\u914D\u7F6E\uFF0C\u8BF7\u8054\u7CFB\u6280\u672F\u652F\u6301" }
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    try {
      const result = await env.DB.prepare(`
        SELECT * FROM admins WHERE email = ? AND password_hash = ?
      `).bind(email.toLowerCase(), password).first();
      if (result) {
        await env.DB.prepare(`
          UPDATE admins SET last_login = CURRENT_TIMESTAMP WHERE id = ?
        `).bind(result.id).run();
        console.log("\u2705 D1\u6570\u636E\u5E93\u8BA4\u8BC1\u6210\u529F");
        return new Response(JSON.stringify({
          user: {
            id: result.id,
            email: result.email,
            name: result.name,
            role: result.role
          },
          authType: "D1_DATABASE"
        }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      }
    } catch (dbError) {
      console.error("D1\u8BA4\u8BC1\u5931\u8D25:", dbError);
      return new Response(JSON.stringify({
        error: { message: `\u6570\u636E\u5E93\u8BA4\u8BC1\u5931\u8D25: ${dbError.message}` }
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    return new Response(JSON.stringify({
      error: { message: "\u90AE\u7BB1\u6216\u5BC6\u7801\u9519\u8BEF" }
    }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    console.error("\u767B\u5F55API\u9519\u8BEF:", error);
    return new Response(JSON.stringify({
      error: { message: "\u767B\u5F55\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5" }
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
__name(handleAdminLogin, "handleAdminLogin");
__name2(handleAdminLogin, "handleAdminLogin");
async function handleGetContacts(request, env) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({
        error: { message: "\u9700\u8981\u767B\u5F55" }
      }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;
    if (!env.DB) {
      return new Response(JSON.stringify({
        error: { message: "D1\u6570\u636E\u5E93\u672A\u914D\u7F6E" }
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    try {
      const contacts = await env.DB.prepare(`
        SELECT id, name, email, phone, company, message, created_at, status, is_read
        FROM contacts 
        ORDER BY created_at DESC 
        LIMIT ? OFFSET ?
      `).bind(limit, offset).all();
      const countResult = await env.DB.prepare(`
        SELECT COUNT(*) as total FROM contacts
      `).first();
      return new Response(JSON.stringify({
        data: contacts.results || [],
        pagination: {
          page,
          limit,
          total: countResult?.total || 0,
          totalPages: Math.ceil((countResult?.total || 0) / limit)
        }
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } catch (dbError) {
      console.error("D1\u67E5\u8BE2\u5931\u8D25:", dbError);
      return new Response(JSON.stringify({
        error: { message: `\u6570\u636E\u5E93\u67E5\u8BE2\u5931\u8D25: ${dbError.message}` }
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  } catch (error) {
    console.error("\u83B7\u53D6\u8054\u7CFB\u6570\u636E\u9519\u8BEF:", error);
    return new Response(JSON.stringify({
      error: { message: "\u83B7\u53D6\u6570\u636E\u5931\u8D25" }
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
__name(handleGetContacts, "handleGetContacts");
__name2(handleGetContacts, "handleGetContacts");
async function handleAPIProxy(request, env) {
  try {
    const url = new URL(request.url);
    const apiPath = url.pathname.replace("/api/", "");
    return new Response(JSON.stringify({
      code: 404,
      message: "API\u8DEF\u7531\u672A\u627E\u5230"
    }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      code: 500,
      message: "\u4EE3\u7406\u9519\u8BEF"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
__name(handleAPIProxy, "handleAPIProxy");
__name2(handleAPIProxy, "handleAPIProxy");
var drainBody = /* @__PURE__ */ __name2(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
__name2(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name2(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
__name2(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
__name2(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");
__name2(__facade_invoke__, "__facade_invoke__");
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  static {
    __name(this, "___Facade_ScheduledController__");
  }
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name2(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name2(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name2(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
__name2(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name2((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name2((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
__name2(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;

// node_modules/.pnpm/wrangler@4.30.0/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody2 = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default2 = drainBody2;

// node_modules/.pnpm/wrangler@4.30.0/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError2(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError2(e.cause)
  };
}
__name(reduceError2, "reduceError");
var jsonError2 = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError2(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default2 = jsonError2;

// .wrangler/tmp/bundle-y3Xynt/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__2 = [
  middleware_ensure_req_body_drained_default2,
  middleware_miniflare3_json_error_default2
];
var middleware_insertion_facade_default2 = middleware_loader_entry_default;

// node_modules/.pnpm/wrangler@4.30.0/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__2 = [];
function __facade_register__2(...args) {
  __facade_middleware__2.push(...args.flat());
}
__name(__facade_register__2, "__facade_register__");
function __facade_invokeChain__2(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__2(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__2, "__facade_invokeChain__");
function __facade_invoke__2(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__2(request, env, ctx, dispatch, [
    ...__facade_middleware__2,
    finalMiddleware
  ]);
}
__name(__facade_invoke__2, "__facade_invoke__");

// .wrangler/tmp/bundle-y3Xynt/middleware-loader.entry.ts
var __Facade_ScheduledController__2 = class ___Facade_ScheduledController__2 {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__2)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler2(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__2 === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__2.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__2) {
    __facade_register__2(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__2(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__2(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler2, "wrapExportedHandler");
function wrapWorkerEntrypoint2(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__2 === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__2.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__2) {
    __facade_register__2(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__2(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__2(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint2, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY2;
if (typeof middleware_insertion_facade_default2 === "object") {
  WRAPPED_ENTRY2 = wrapExportedHandler2(middleware_insertion_facade_default2);
} else if (typeof middleware_insertion_facade_default2 === "function") {
  WRAPPED_ENTRY2 = wrapWorkerEntrypoint2(middleware_insertion_facade_default2);
}
var middleware_loader_entry_default2 = WRAPPED_ENTRY2;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__2 as __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default2 as default
};
//# sourceMappingURL=bundledWorker-0.6662444765743949.js.map
