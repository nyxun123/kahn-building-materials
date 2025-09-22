var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-Xbr3Da/checked-fetch.js
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

// .wrangler/tmp/pages-Zg5h5f/bundledWorker-0.5102207708433102.mjs
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
    console.log("API\u8BF7\u6C42:", url.pathname, request.method);
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
      console.log("\u{1F3AF} Routing to handleContactAPI");
      return handleContactAPI(request, env);
    }
    if (url.pathname === "/api/upload-image") {
      console.log("\u{1F3AF} Routing to handleImageUpload");
      if (request.method === "POST") {
        return handleImageUpload(request, env);
      } else if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "86400"
          }
        });
      }
    }
    if (url.pathname === "/api/admin/login" && request.method === "POST") {
      console.log("\u{1F3AF} Routing to handleAdminLogin");
      return handleAdminLogin(request, env);
    }
    if (url.pathname === "/api/products" && request.method === "GET") {
      console.log("\u{1F3AF} Routing to handlePublicProducts");
      return handlePublicProducts(request, env);
    }
    if (url.pathname.startsWith("/api/products/") && request.method === "GET") {
      if (url.pathname !== "/api/products/") {
        console.log("\u{1F3AF} Routing to handleGetSingleProductByCode");
        const productCode = url.pathname.split("/").pop();
        if (productCode) {
          return handleGetSingleProductByCode(request, env, productCode);
        }
      }
    }
    if (url.pathname === "/api/admin/products" && request.method === "GET") {
      console.log("\u{1F3AF} Routing to handleGetProducts");
      return handleGetProducts(request, env);
    }
    if (url.pathname === "/api/admin/products" && request.method === "POST") {
      console.log("\u{1F3AF} Routing to handleCreateProduct");
      return handleCreateProduct(request, env);
    }
    if (url.pathname.startsWith("/api/admin/products/") && request.method === "PUT") {
      if (url.pathname !== "/api/admin/products/") {
        console.log("\u{1F3AF} Routing to handleUpdateProduct");
        return handleUpdateProduct(request, env);
      }
    }
    if (url.pathname.startsWith("/api/admin/products/") && request.method === "DELETE") {
      if (url.pathname !== "/api/admin/products/") {
        console.log("\u{1F3AF} Routing to handleDeleteProduct");
        return handleDeleteProduct(request, env);
      }
    }
    if (url.pathname.startsWith("/api/admin/products/") && request.method === "GET") {
      if (url.pathname !== "/api/admin/products/") {
        console.log("\u{1F3AF} Routing to handleGetSingleProduct");
        return handleGetSingleProduct(request, env);
      }
    }
    if (url.pathname === "/api/admin/contacts" && request.method === "GET") {
      console.log("\u{1F3AF} Routing to handleGetContacts");
      return handleGetContacts(request, env);
    }
    if (url.pathname.startsWith("/api/admin/contacts/") && request.method === "PUT") {
      if (url.pathname !== "/api/admin/contacts/") {
        console.log("\u{1F3AF} Routing to handleUpdateContact");
        return handleUpdateContact(request, env);
      }
    }
    if (url.pathname.startsWith("/api/admin/contacts/") && request.method === "DELETE") {
      if (url.pathname !== "/api/admin/contacts/") {
        console.log("\u{1F3AF} Routing to handleDeleteContact");
        return handleDeleteContact(request, env);
      }
    }
    if (url.pathname === "/api/admin/contents" && request.method === "GET") {
      console.log("\u{1F3AF} Routing to handleGetContents");
      return handleGetContents(request, env);
    }
    if (url.pathname.startsWith("/api/admin/contents/") && request.method === "PUT") {
      if (url.pathname !== "/api/admin/contents/") {
        console.log("\u{1F3AF} Routing to handleUpdateContent");
        return handleUpdateContent(request, env);
      }
    }
    if (url.pathname === "/api/content/home" && request.method === "GET") {
      console.log("\u{1F3AF} Routing to handleGetPageContent for home");
      return handleGetPageContent(request, env, "home");
    }
    if (url.pathname === "/api/content/products" && request.method === "GET") {
      console.log("\u{1F3AF} Routing to handleGetPageContent for products");
      return handleGetPageContent(request, env, "products");
    }
    if (url.pathname === "/api/content/oem" && request.method === "GET") {
      console.log("\u{1F3AF} Routing to handleGetPageContent for oem");
      return handleGetPageContent(request, env, "oem");
    }
    if (url.pathname === "/api/content/about" && request.method === "GET") {
      console.log("\u{1F3AF} Routing to handleGetPageContent for about");
      return handleGetPageContent(request, env, "about");
    }
    if (url.pathname === "/api/content/contact" && request.method === "GET") {
      console.log("\u{1F3AF} Routing to handleGetPageContent for contact");
      return handleGetPageContent(request, env, "contact");
    }
    if (url.pathname === "/api/admin/content/home" && request.method === "GET") {
      console.log("\u{1F3AF} Routing to handleGetAdminPageContent for home");
      return handleGetAdminPageContent(request, env, "home");
    }
    if (url.pathname === "/api/admin/content/home" && request.method === "POST") {
      console.log("\u{1F3AF} Routing to handleCreatePageContent for home");
      return handleCreatePageContent(request, env, "home");
    }
    if (url.pathname.startsWith("/api/admin/content/home/") && request.method === "PUT") {
      if (url.pathname !== "/api/admin/content/home/") {
        console.log("\u{1F3AF} Routing to handleUpdatePageContent for home");
        return handleUpdatePageContent(request, env, "home");
      }
    }
    if (url.pathname.startsWith("/api/admin/content/home/") && request.method === "DELETE") {
      if (url.pathname !== "/api/admin/content/home/") {
        console.log("\u{1F3AF} Routing to handleDeletePageContent for home");
        return handleDeletePageContent(request, env, "home");
      }
    }
    if (url.pathname === "/api/admin/content/products" && request.method === "GET") {
      console.log("\u{1F3AF} Routing to handleGetAdminPageContent for products");
      return handleGetAdminPageContent(request, env, "products");
    }
    if (url.pathname === "/api/admin/content/products" && request.method === "POST") {
      console.log("\u{1F3AF} Routing to handleCreatePageContent for products");
      return handleCreatePageContent(request, env, "products");
    }
    if (url.pathname.startsWith("/api/admin/content/products/") && request.method === "PUT") {
      if (url.pathname !== "/api/admin/content/products/") {
        console.log("\u{1F3AF} Routing to handleUpdatePageContent for products");
        return handleUpdatePageContent(request, env, "products");
      }
    }
    if (url.pathname.startsWith("/api/admin/content/products/") && request.method === "DELETE") {
      if (url.pathname !== "/api/admin/content/products/") {
        console.log("\u{1F3AF} Routing to handleDeletePageContent for products");
        return handleDeletePageContent(request, env, "products");
      }
    }
    if (url.pathname === "/api/admin/content/oem" && request.method === "GET") {
      console.log("\u{1F3AF} Routing to handleGetAdminPageContent for oem");
      return handleGetAdminPageContent(request, env, "oem");
    }
    if (url.pathname === "/api/admin/content/oem" && request.method === "POST") {
      console.log("\u{1F3AF} Routing to handleCreatePageContent for oem");
      return handleCreatePageContent(request, env, "oem");
    }
    if (url.pathname.startsWith("/api/admin/content/oem/") && request.method === "PUT") {
      if (url.pathname !== "/api/admin/content/oem/") {
        console.log("\u{1F3AF} Routing to handleUpdatePageContent for oem");
        return handleUpdatePageContent(request, env, "oem");
      }
    }
    if (url.pathname.startsWith("/api/admin/content/oem/") && request.method === "DELETE") {
      if (url.pathname !== "/api/admin/content/oem/") {
        console.log("\u{1F3AF} Routing to handleDeletePageContent for oem");
        return handleDeletePageContent(request, env, "oem");
      }
    }
    if (url.pathname === "/api/admin/content/about" && request.method === "GET") {
      console.log("\u{1F3AF} Routing to handleGetAdminPageContent for about");
      return handleGetAdminPageContent(request, env, "about");
    }
    if (url.pathname === "/api/admin/content/about" && request.method === "POST") {
      console.log("\u{1F3AF} Routing to handleCreatePageContent for about");
      return handleCreatePageContent(request, env, "about");
    }
    if (url.pathname.startsWith("/api/admin/content/about/") && request.method === "PUT") {
      if (url.pathname !== "/api/admin/content/about/") {
        console.log("\u{1F3AF} Routing to handleUpdatePageContent for about");
        return handleUpdatePageContent(request, env, "about");
      }
    }
    if (url.pathname.startsWith("/api/admin/content/about/") && request.method === "DELETE") {
      if (url.pathname !== "/api/admin/content/about/") {
        console.log("\u{1F3AF} Routing to handleDeletePageContent for about");
        return handleDeletePageContent(request, env, "about");
      }
    }
    if (url.pathname === "/api/admin/content/contact" && request.method === "GET") {
      console.log("\u{1F3AF} Routing to handleGetAdminPageContent for contact");
      return handleGetAdminPageContent(request, env, "contact");
    }
    if (url.pathname === "/api/admin/content/contact" && request.method === "POST") {
      console.log("\u{1F3AF} Routing to handleCreatePageContent for contact");
      return handleCreatePageContent(request, env, "contact");
    }
    if (url.pathname.startsWith("/api/admin/content/contact/") && request.method === "PUT") {
      if (url.pathname !== "/api/admin/content/contact/") {
        console.log("\u{1F3AF} Routing to handleUpdatePageContent for contact");
        return handleUpdatePageContent(request, env, "contact");
      }
    }
    if (url.pathname.startsWith("/api/admin/content/contact/") && request.method === "DELETE") {
      if (url.pathname !== "/api/admin/content/contact/") {
        console.log("\u{1F3AF} Routing to handleDeletePageContent for contact");
        return handleDeletePageContent(request, env, "contact");
      }
    }
    if (url.pathname === "/api/admin/dashboard/stats" && request.method === "GET") {
      console.log("\u{1F3AF} Routing to handleDashboardStats");
      return handleDashboardStats(request, env);
    }
    if (url.pathname === "/api/admin/dashboard/activities" && request.method === "GET") {
      console.log("\u{1F3AF} Routing to handleDashboardActivities");
      return handleDashboardActivities(request, env);
    }
    if (url.pathname === "/api/admin/dashboard/health" && request.method === "GET") {
      console.log("\u{1F3AF} Routing to handleDashboardHealth");
      return handleDashboardHealth(request, env);
    }
    if (url.pathname.startsWith("/api/company/info/") && request.method === "GET") {
      if (url.pathname !== "/api/company/info/") {
        console.log("\u{1F3AF} Routing to handleCompanyInfo");
        return handleCompanyInfo(request, env);
      }
    }
    if (url.pathname.startsWith("/api/company/content/") && request.method === "GET") {
      if (url.pathname !== "/api/company/content/") {
        console.log("\u{1F3AF} Routing to handleCompanyContent");
        return handleCompanyContent(request, env);
      }
    }
    if (url.pathname === "/api/admin/company/info" && request.method === "GET") {
      console.log("\u{1F3AF} Routing to handleAdminCompanyInfo");
      return handleAdminCompanyInfo(request, env);
    }
    if (url.pathname === "/api/admin/company/info" && request.method === "POST") {
      console.log("\u{1F3AF} Routing to handleCreateCompanyInfo");
      return handleCreateCompanyInfo(request, env);
    }
    if (url.pathname.startsWith("/api/admin/company/info/") && request.method === "PUT") {
      if (url.pathname !== "/api/admin/company/info/") {
        console.log("\u{1F3AF} Routing to handleUpdateCompanyInfo");
        return handleUpdateCompanyInfo(request, env);
      }
    }
    if (url.pathname.startsWith("/api/admin/company/info/") && request.method === "DELETE") {
      if (url.pathname !== "/api/admin/company/info/") {
        console.log("\u{1F3AF} Routing to handleDeleteCompanyInfo");
        return handleDeleteCompanyInfo(request, env);
      }
    }
    if (url.pathname === "/api/admin/company/content" && request.method === "GET") {
      console.log("\u{1F3AF} Routing to handleAdminCompanyContent");
      return handleAdminCompanyContent(request, env);
    }
    if (url.pathname === "/api/admin/company/content" && request.method === "POST") {
      console.log("\u{1F3AF} Routing to handleCreateCompanyContent");
      return handleCreateCompanyContent(request, env);
    }
    if (url.pathname.startsWith("/api/admin/company/content/") && request.method === "PUT") {
      if (url.pathname !== "/api/admin/company/content/") {
        console.log("\u{1F3AF} Routing to handleUpdateCompanyContent");
        return handleUpdateCompanyContent(request, env);
      }
    }
    if (url.pathname.startsWith("/api/admin/company/content/") && request.method === "DELETE") {
      if (url.pathname !== "/api/admin/company/content/") {
        console.log("\u{1F3AF} Routing to handleDeleteCompanyContent");
        return handleDeleteCompanyContent(request, env);
      }
    }
    if (url.pathname.startsWith("/api/")) {
      console.log("\u{1F3AF} Routing to handleAPIProxy for unmatched API route:", url.pathname);
      return handleAPIProxy(request, env);
    }
    console.log("\u26A0\uFE0F  Unmatched route - falling back to static assets:", {
      method: request.method,
      pathname: url.pathname,
      search: url.search
    });
    return env.ASSETS.fetch(request);
  }
};
async function handleContactAPI(request, env) {
  const startTime = performance.now();
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return createErrorResponse(400, "\u8BF7\u6C42\u683C\u5F0F\u9519\u8BEF\uFF1A\u65E0\u6548\u7684JSON\u6570\u636E");
    }
    if (!body?.data) {
      return createErrorResponse(400, "\u8BF7\u6C42\u683C\u5F0F\u9519\u8BEF\uFF1A\u7F3A\u5C11data\u5B57\u6BB5");
    }
    const data = body.data;
    const required = ["name", "email", "message"];
    const missingFields = required.filter((field) => !data[field]?.trim());
    if (missingFields.length > 0) {
      return createErrorResponse(400, `\u8BF7\u586B\u5199\u5FC5\u586B\u5B57\u6BB5: ${missingFields.join(", ")}`);
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      return createErrorResponse(400, "\u90AE\u7BB1\u683C\u5F0F\u4E0D\u6B63\u786E");
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
      "bitcoin",
      "crypto"
    ];
    const content = `${data.name} ${data.message}`.toLowerCase();
    const spamScore = spamKeywords.reduce((count, keyword) => {
      return count + (content.includes(keyword) ? 1 : 0);
    }, 0);
    if (spamScore >= 2 || content.length > 5e3) {
      console.warn("\u{1F6A8} \u7591\u4F3C\u5783\u573E\u4FE1\u606F:", {
        spamScore,
        contentLength: content.length,
        email: data.email
      });
      return createErrorResponse(400, "\u68C0\u6D4B\u5230\u53EF\u7591\u5185\u5BB9\uFF0C\u8BF7\u91CD\u65B0\u586B\u5199");
    }
    const messageLength = data.message.trim().length;
    if (messageLength < 10) {
      return createErrorResponse(400, "\u6D88\u606F\u5185\u5BB9\u592A\u77ED\uFF0C\u8BF7\u63D0\u4F9B\u66F4\u591A\u4FE1\u606F");
    }
    if (messageLength > 2e3) {
      return createErrorResponse(400, "\u6D88\u606F\u5185\u5BB9\u8FC7\u957F\uFF0C\u8BF7\u7CBE\u7B80\u52302000\u5B57\u4EE5\u5185");
    }
    if (!env.DB) {
      return createErrorResponse(500, "D1\u6570\u636E\u5E93\u672A\u914D\u7F6E\uFF0C\u8BF7\u8054\u7CFB\u6280\u672F\u652F\u6301");
    }
    try {
      const clientIP = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
      const userAgent = request.headers.get("user-agent")?.substring(0, 500) || "unknown";
      const contactData = {
        name: data.name.trim().substring(0, 100),
        email: data.email.trim().toLowerCase().substring(0, 255),
        phone: data.phone?.trim().substring(0, 50) || "",
        company: data.company?.trim().substring(0, 200) || "",
        message: data.message.trim().substring(0, 2e3),
        ip_address: clientIP,
        user_agent: userAgent
      };
      console.log("\u{1F4DD} \u5904\u7406\u8054\u7CFB\u8868\u5355:", {
        name: contactData.name,
        email: contactData.email,
        hasPhone: !!contactData.phone,
        hasCompany: !!contactData.company,
        messageLength: contactData.message.length,
        ip: clientIP
      });
      const result = await env.DB.prepare(`
        INSERT INTO contacts (name, email, phone, company, message, ip_address, user_agent)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(
        contactData.name,
        contactData.email,
        contactData.phone,
        contactData.company,
        contactData.message,
        contactData.ip_address,
        contactData.user_agent
      ).run();
      if (!result.meta?.last_row_id) {
        throw new Error("\u8054\u7CFB\u4FE1\u606F\u4FDD\u5B58\u5931\u8D25\uFF1A\u672A\u83B7\u5F97\u8BB0\u5F55ID");
      }
      const elapsedTime = performance.now() - startTime;
      console.log("\u2705 \u8054\u7CFB\u8868\u5355\u4FDD\u5B58\u6210\u529F:", {
        id: result.meta.last_row_id,
        email: contactData.email,
        time: `${elapsedTime.toFixed(2)}ms`
      });
      sendNotification(contactData, env).catch((error) => {
        console.warn("\u901A\u77E5\u53D1\u9001\u5931\u8D25:", error);
      });
      return new Response(JSON.stringify({
        code: 200,
        message: "\u6D88\u606F\u63D0\u4EA4\u6210\u529F\uFF0C\u6211\u4EEC\u5C06\u5C3D\u5FEB\u56DE\u590D\u60A8",
        data: {
          id: result.meta.last_row_id,
          submitted_at: (/* @__PURE__ */ new Date()).toISOString(),
          storage: "D1_DATABASE"
        },
        meta: {
          processTime: elapsedTime.toFixed(2)
        }
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-cache"
        }
      });
    } catch (dbError) {
      const elapsedTime = performance.now() - startTime;
      console.error("D1\u6570\u636E\u5E93\u9519\u8BEF:", {
        error: dbError.message,
        email: data.email,
        time: `${elapsedTime.toFixed(2)}ms`
      });
      return createErrorResponse(500, `\u6570\u636E\u5E93\u5B58\u50A8\u5931\u8D25: ${dbError.message}`);
    }
  } catch (error) {
    const elapsedTime = performance.now() - startTime;
    console.error("\u8054\u7CFBAPI\u9519\u8BEF:", {
      error: error.message,
      time: `${elapsedTime.toFixed(2)}ms`
    });
    return createErrorResponse(500, `\u670D\u52A1\u5668\u9519\u8BEF: ${error.message}`);
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
  const startTime = performance.now();
  console.log("\u{1F680} \u5F00\u59CB\u5904\u7406\u56FE\u7247\u4E0A\u4F20\u8BF7\u6C42");
  try {
    if (request.method !== "POST") {
      console.log("\u274C \u4E0D\u652F\u6301\u7684\u8BF7\u6C42\u65B9\u6CD5:", request.method);
      return createErrorResponse(405, "\u4EC5\u652F\u6301POST\u8BF7\u6C42");
    }
    const requestInfo = {
      contentType: request.headers.get("content-type"),
      contentLength: request.headers.get("content-length"),
      userAgent: request.headers.get("user-agent"),
      origin: request.headers.get("origin")
    };
    console.log("\u{1F4DD} \u8BF7\u6C42\u4FE1\u606F:", requestInfo);
    let formData;
    try {
      formData = await request.formData();
      console.log("\u2705 FormData \u89E3\u6790\u6210\u529F");
    } catch (formError) {
      console.error("\u274C FormData \u89E3\u6790\u5931\u8D25:", {
        error: formError.message,
        stack: formError.stack,
        contentType: requestInfo.contentType
      });
      let errorMessage = "\u8BF7\u6C42\u683C\u5F0F\u9519\u8BEF";
      if (formError.message.includes("boundary")) {
        errorMessage = "\u6587\u4EF6\u4E0A\u4F20\u683C\u5F0F\u9519\u8BEF\uFF0C\u8BF7\u91CD\u65B0\u9009\u62E9\u6587\u4EF6";
      } else if (formError.message.includes("timeout")) {
        errorMessage = "\u6587\u4EF6\u4E0A\u4F20\u8D85\u65F6\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC\u8FDE\u63A5";
      } else {
        errorMessage = `\u8BF7\u6C42\u89E3\u6790\u5931\u8D25: ${formError.message}`;
      }
      return createErrorResponse(400, errorMessage);
    }
    const file = formData.get("file");
    const folder = formData.get("folder") || "products";
    console.log("\u{1F4C1} \u6587\u4EF6\u4FE1\u606F:", {
      hasFile: !!file,
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      folder
    });
    if (!file || !(file instanceof File)) {
      console.error("\u274C \u672A\u627E\u5230\u6709\u6548\u6587\u4EF6:", typeof file);
      return createErrorResponse(400, "\u8BF7\u9009\u62E9\u8981\u4E0A\u4F20\u7684\u6587\u4EF6");
    }
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      console.error("\u274C \u6587\u4EF6\u8FC7\u5927:", { size: file.size, maxSize });
      return createErrorResponse(400, `\u6587\u4EF6\u5927\u5C0F\u4E0D\u80FD\u8D85\u8FC75MB\uFF08\u5F53\u524D: ${Math.round(file.size / 1024 / 1024 * 100) / 100}MB\uFF09`);
    }
    const supportedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!file.type || !supportedTypes.includes(file.type.toLowerCase())) {
      console.error("\u274C \u4E0D\u652F\u6301\u7684\u6587\u4EF6\u7C7B\u578B:", file.type);
      return createErrorResponse(400, `\u4E0D\u652F\u6301\u7684\u56FE\u7247\u683C\u5F0F: ${file.type}\u3002\u652F\u6301: JPEG, PNG, WebP, GIF`);
    }
    const timestamp = Date.now();
    const randomStr = crypto.getRandomValues(new Uint8Array(4)).reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safeFileName = `${folder}/${timestamp}_${randomStr}.${fileExt}`;
    console.log("\u{1F680} \u5F00\u59CB\u5904\u7406\u6587\u4EF6:", safeFileName);
    try {
      if (env.IMAGE_BUCKET) {
        console.log("\u2601\uFE0F \u4F7F\u7528Cloudflare R2\u5B58\u50A8");
        const putResult = await env.IMAGE_BUCKET.put(safeFileName, file.stream(), {
          httpMetadata: {
            contentType: file.type,
            cacheControl: "public, max-age=31536000",
            contentDisposition: `inline; filename="${file.name}"`
          },
          customMetadata: {
            originalName: file.name,
            uploadTime: (/* @__PURE__ */ new Date()).toISOString(),
            folder,
            fileSize: file.size.toString()
          }
        });
        if (!putResult) {
          throw new Error("R2\u4E0A\u4F20\u5931\u8D25\uFF0C\u672A\u8FD4\u56DE\u7ED3\u679C");
        }
        const imageUrl = `https://pub-b9f0c2c358074609bf8701513c879957.r2.dev/${safeFileName}`;
        const elapsedTime = performance.now() - startTime;
        console.log("\u2705 R2\u4E0A\u4F20\u6210\u529F:", { url: imageUrl, time: `${elapsedTime.toFixed(2)}ms` });
        return new Response(JSON.stringify({
          code: 200,
          message: "\u56FE\u7247\u4E0A\u4F20\u6210\u529F",
          data: {
            original: imageUrl,
            large: imageUrl,
            medium: imageUrl,
            small: imageUrl,
            thumbnail: imageUrl,
            fileName: safeFileName,
            fileSize: file.size,
            fileType: file.type,
            uploadMethod: "cloudflare_r2",
            uploadTime: elapsedTime,
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
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-cache"
          }
        });
      } else {
        console.log("\u26A0\uFE0F \u4F7F\u7528base64\u4E34\u65F6\u5B58\u50A8");
        if (file.size > 2 * 1024 * 1024) {
          return createErrorResponse(413, "\u4E34\u65F6\u5B58\u50A8\u6A21\u5F0F\u4E0B\uFF0C\u6587\u4EF6\u5927\u5C0F\u4E0D\u80FD\u8D85\u8FC72MB");
        }
        const arrayBuffer = await file.arrayBuffer();
        console.log("\u{1F4E6} \u83B7\u53D6ArrayBuffer:", arrayBuffer.byteLength);
        const bytes = new Uint8Array(arrayBuffer);
        let binary = "";
        const chunkSize = 32768;
        for (let i = 0; i < bytes.length; i += chunkSize) {
          const chunk = bytes.subarray(i, i + chunkSize);
          binary += String.fromCharCode.apply(null, chunk);
        }
        const base64 = btoa(binary);
        const dataUrl = `data:${file.type};base64,${base64}`;
        const elapsedTime = performance.now() - startTime;
        console.log("\u2705 base64\u751F\u6210\u6210\u529F:", {
          dataUrlLength: dataUrl.length,
          time: `${elapsedTime.toFixed(2)}ms`
        });
        return new Response(JSON.stringify({
          code: 200,
          message: "\u56FE\u7247\u4E0A\u4F20\u6210\u529F\uFF08\u4E34\u65F6\u5B58\u50A8\uFF09",
          data: {
            original: dataUrl,
            large: dataUrl,
            medium: dataUrl,
            small: dataUrl,
            thumbnail: dataUrl,
            fileName: safeFileName,
            fileSize: file.size,
            fileType: file.type,
            uploadMethod: "base64_storage",
            uploadTime: elapsedTime,
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
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-cache"
          }
        });
      }
    } catch (uploadError) {
      const elapsedTime = performance.now() - startTime;
      console.error("\u{1F6A8} \u56FE\u7247\u5904\u7406\u9519\u8BEF:", {
        error: uploadError.message,
        stack: uploadError.stack,
        fileName: safeFileName,
        fileSize: file.size,
        time: `${elapsedTime.toFixed(2)}ms`
      });
      return createErrorResponse(500, `\u4E0A\u4F20\u5931\u8D25: ${uploadError.message}`);
    }
  } catch (error) {
    const elapsedTime = performance.now() - startTime;
    console.error("\u{1F6A8} \u56FE\u7247\u4E0A\u4F20\u9519\u8BEF:", {
      error: error.message,
      stack: error.stack,
      time: `${elapsedTime.toFixed(2)}ms`
    });
    return createErrorResponse(500, `\u56FE\u7247\u4E0A\u4F20\u5931\u8D25: ${error.message}`);
  }
}
__name(handleImageUpload, "handleImageUpload");
__name2(handleImageUpload, "handleImageUpload");
function createErrorResponse(status, message) {
  return new Response(JSON.stringify({
    code: status,
    message,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  }), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
__name(createErrorResponse, "createErrorResponse");
__name2(createErrorResponse, "createErrorResponse");
function createAuthError() {
  return new Response(JSON.stringify({
    error: { message: "\u9700\u8981\u767B\u5F55" },
    code: 401
  }), {
    status: 401,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
__name(createAuthError, "createAuthError");
__name2(createAuthError, "createAuthError");
async function handleAdminLogin(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (parseError) {
    return createErrorResponse(400, "\u8BF7\u6C42\u683C\u5F0F\u9519\u8BEF");
  }
  const { email, password } = body || {};
  if (!email || !password) {
    return createErrorResponse(400, "\u8BF7\u586B\u5199\u90AE\u7BB1\u548C\u5BC6\u7801");
  }
  if (!env.DB) {
    return createErrorResponse(500, "D1\u6570\u636E\u5E93\u672A\u914D\u7F6E\uFF0C\u8BF7\u8054\u7CFB\u6280\u672F\u652F\u6301");
  }
  try {
    const result = await env.DB.prepare(`
      SELECT * FROM admins WHERE email = ?
    `).bind(email.toLowerCase()).first();
    if (result && result.password_hash === password) {
      await env.DB.prepare(`
        UPDATE admins SET last_login = CURRENT_TIMESTAMP WHERE id = ?
      `).bind(result.id).run();
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
    return createErrorResponse(500, `\u6570\u636E\u5E93\u8BA4\u8BC1\u5931\u8D25: ${dbError.message}`);
  }
  return createErrorResponse(401, "\u90AE\u7BB1\u6216\u5BC6\u7801\u9519\u8BEF");
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
async function handleGetProducts(request, env) {
  const startTime = performance.now();
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return createAuthError();
    }
    const url = new URL(request.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get("limit") || "20")));
    const offset = (page - 1) * limit;
    if (!env.DB) {
      return createErrorResponse(500, "D1\u6570\u636E\u5E93\u672A\u914D\u7F6E");
    }
    try {
      const [productsResult, countResult] = await Promise.all([
        env.DB.prepare(`
          SELECT id, product_code, name_zh, name_en, name_ru,
                 description_zh, description_en, description_ru,
                 price, price_range, image_url, category, 
                 is_active, sort_order, created_at, updated_at,
                 features_zh, features_en, features_ru
          FROM products 
          ORDER BY sort_order ASC, created_at DESC 
          LIMIT ? OFFSET ?
        `).bind(limit, offset).all(),
        env.DB.prepare(`SELECT COUNT(*) as total FROM products`).first()
      ]);
      const elapsedTime = performance.now() - startTime;
      if (elapsedTime > 200) {
        console.warn("\u{1F40C} \u4EA7\u54C1\u67E5\u8BE2\u8F83\u6162:", `${elapsedTime.toFixed(2)}ms`);
      }
      return new Response(JSON.stringify({
        data: productsResult.results || [],
        pagination: {
          page,
          limit,
          total: countResult?.total || 0,
          totalPages: Math.ceil((countResult?.total || 0) / limit)
        },
        meta: {
          queryTime: elapsedTime.toFixed(2),
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "private, max-age=60"
          // 1分钟缓存
        }
      });
    } catch (dbError) {
      const elapsedTime = performance.now() - startTime;
      console.error("D1\u67E5\u8BE2\u5931\u8D25:", {
        error: dbError.message,
        time: `${elapsedTime.toFixed(2)}ms`,
        page,
        limit
      });
      return createErrorResponse(500, `\u6570\u636E\u5E93\u67E5\u8BE2\u5931\u8D25: ${dbError.message}`);
    }
  } catch (error) {
    const elapsedTime = performance.now() - startTime;
    console.error("\u83B7\u53D6\u4EA7\u54C1\u6570\u636E\u9519\u8BEF:", {
      error: error.message,
      time: `${elapsedTime.toFixed(2)}ms`
    });
    return createErrorResponse(500, "\u83B7\u53D6\u6570\u636E\u5931\u8D25");
  }
}
__name(handleGetProducts, "handleGetProducts");
__name2(handleGetProducts, "handleGetProducts");
async function handleAPIProxy(request, env) {
  try {
    const url = new URL(request.url);
    const apiPath = url.pathname.replace("/api/", "");
    console.log("\u{1F6A8} API\u8DEF\u7531\u672A\u627E\u5230:", {
      pathname: url.pathname,
      apiPath,
      method: request.method
    });
    return new Response(JSON.stringify({
      code: 404,
      message: "API\u8DEF\u7531\u672A\u627E\u5230",
      debug: {
        pathname: url.pathname,
        apiPath,
        method: request.method
      }
    }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    console.error("\u{1F6A8} API\u4EE3\u7406\u9519\u8BEF:", error);
    return new Response(JSON.stringify({
      code: 500,
      message: "\u4EE3\u7406\u9519\u8BEF",
      error: error.message
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
async function handleCreateProduct(request, env) {
  const startTime = performance.now();
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return createAuthError();
    }
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return createErrorResponse(400, "\u8BF7\u6C42\u6570\u636E\u683C\u5F0F\u9519\u8BEF");
    }
    const {
      product_code,
      name_zh,
      name_en,
      name_ru,
      description_zh,
      description_en,
      description_ru,
      specifications_zh,
      specifications_en,
      specifications_ru,
      applications_zh,
      applications_en,
      applications_ru,
      packaging_options_zh,
      packaging_options_en,
      packaging_options_ru,
      category,
      price,
      price_range,
      features_zh,
      features_en,
      features_ru,
      image_url,
      is_active = true,
      sort_order = 0
    } = body;
    console.log("\u{1F4DD} \u63A5\u6536\u7684\u4EA7\u54C1\u6570\u636E:", {
      product_code,
      name_zh,
      name_en,
      name_ru,
      category,
      hasDescriptionZh: !!description_zh,
      hasDescriptionEn: !!description_en,
      hasFeaturesZh: !!features_zh,
      is_active,
      sort_order
    });
    if (!product_code?.trim() || !name_zh?.trim() || !name_en?.trim()) {
      return createErrorResponse(400, "\u8BF7\u586B\u5199\u4EA7\u54C1\u4EE3\u7801\u3001\u4E2D\u82F1\u6587\u540D\u79F0");
    }
    const finalCategory = category?.trim() || "adhesive";
    if (!env.DB) {
      return createErrorResponse(500, "D1\u6570\u636E\u5E93\u672A\u914D\u7F6E");
    }
    try {
      const processFeatures = /* @__PURE__ */ __name2((features) => {
        if (!features) return "[]";
        if (typeof features === "string") {
          try {
            JSON.parse(features);
            return features;
          } catch {
            return JSON.stringify([features]);
          }
        }
        if (Array.isArray(features)) return JSON.stringify(features);
        return "[]";
      }, "processFeatures");
      const [existingProduct] = await Promise.all([
        env.DB.prepare(`SELECT id FROM products WHERE product_code = ?`).bind(product_code).first()
      ]);
      if (existingProduct) {
        return createErrorResponse(400, "\u4EA7\u54C1\u4EE3\u7801\u5DF2\u5B58\u5728");
      }
      const productData = {
        product_code: product_code.trim(),
        name_zh: name_zh.trim(),
        name_en: name_en.trim(),
        name_ru: name_ru?.trim() || "",
        description_zh: description_zh?.trim() || "",
        description_en: description_en?.trim() || "",
        description_ru: description_ru?.trim() || "",
        specifications_zh: specifications_zh?.trim() || "",
        specifications_en: specifications_en?.trim() || "",
        specifications_ru: specifications_ru?.trim() || "",
        applications_zh: applications_zh?.trim() || "",
        applications_en: applications_en?.trim() || "",
        applications_ru: applications_ru?.trim() || "",
        packaging_options_zh: packaging_options_zh?.trim() || "",
        packaging_options_en: packaging_options_en?.trim() || "",
        packaging_options_ru: packaging_options_ru?.trim() || "",
        category: finalCategory,
        price: typeof price === "number" ? price : 0,
        price_range: price_range?.trim() || "",
        features_zh: processFeatures(features_zh),
        features_en: processFeatures(features_en),
        features_ru: processFeatures(features_ru),
        image_url: image_url?.trim() || "",
        gallery_images: body.gallery_images?.trim() || "",
        tags: body.tags?.trim() || "",
        is_active: Boolean(is_active) ? 1 : 0,
        // 确保布尔值转为整数
        is_featured: Boolean(body.is_featured) ? 1 : 0,
        sort_order: typeof sort_order === "number" ? sort_order : 0,
        stock_quantity: typeof body.stock_quantity === "number" ? body.stock_quantity : 0,
        min_order_quantity: typeof body.min_order_quantity === "number" ? body.min_order_quantity : 1,
        meta_title_zh: body.meta_title_zh?.trim() || "",
        meta_title_en: body.meta_title_en?.trim() || "",
        meta_title_ru: body.meta_title_ru?.trim() || "",
        meta_description_zh: body.meta_description_zh?.trim() || "",
        meta_description_en: body.meta_description_en?.trim() || "",
        meta_description_ru: body.meta_description_ru?.trim() || ""
      };
      console.log("\u{1F4DD} \u521B\u5EFA\u4EA7\u54C1:", {
        product_code: productData.product_code,
        name_zh: productData.name_zh,
        category: productData.category,
        hasImage: !!productData.image_url
      });
      const result = await env.DB.prepare(`
        INSERT INTO products (
          product_code, name_zh, name_en, name_ru,
          description_zh, description_en, description_ru,
          specifications_zh, specifications_en, specifications_ru,
          applications_zh, applications_en, applications_ru,
          packaging_options_zh, packaging_options_en, packaging_options_ru,
          category, price, price_range,
          features_zh, features_en, features_ru,
          image_url, gallery_images, tags,
          is_active, is_featured, sort_order,
          stock_quantity, min_order_quantity,
          meta_title_zh, meta_title_en, meta_title_ru,
          meta_description_zh, meta_description_en, meta_description_ru
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        productData.product_code,
        productData.name_zh,
        productData.name_en,
        productData.name_ru,
        productData.description_zh,
        productData.description_en,
        productData.description_ru,
        productData.specifications_zh,
        productData.specifications_en,
        productData.specifications_ru,
        productData.applications_zh,
        productData.applications_en,
        productData.applications_ru,
        productData.packaging_options_zh,
        productData.packaging_options_en,
        productData.packaging_options_ru,
        productData.category,
        productData.price,
        productData.price_range,
        productData.features_zh,
        productData.features_en,
        productData.features_ru,
        productData.image_url,
        productData.gallery_images,
        productData.tags,
        productData.is_active,
        productData.is_featured,
        productData.sort_order,
        productData.stock_quantity,
        productData.min_order_quantity,
        productData.meta_title_zh,
        productData.meta_title_en,
        productData.meta_title_ru,
        productData.meta_description_zh,
        productData.meta_description_en,
        productData.meta_description_ru
      ).run();
      if (!result.meta?.last_row_id) {
        throw new Error("\u4EA7\u54C1\u521B\u5EFA\u5931\u8D25\uFF1A\u672A\u83B7\u5F97\u65B0\u4EA7\u54C1ID");
      }
      const newProduct = await env.DB.prepare(`
        SELECT * FROM products WHERE id = ?
      `).bind(result.meta.last_row_id).first();
      const elapsedTime = performance.now() - startTime;
      console.log("\u2705 \u4EA7\u54C1\u521B\u5EFA\u6210\u529F:", {
        id: result.meta.last_row_id,
        product_code: productData.product_code,
        time: `${elapsedTime.toFixed(2)}ms`
      });
      return new Response(JSON.stringify({
        data: newProduct,
        message: "\u4EA7\u54C1\u521B\u5EFA\u6210\u529F",
        meta: {
          createTime: elapsedTime.toFixed(2),
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }
      }), {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-cache"
        }
      });
    } catch (dbError) {
      const elapsedTime = performance.now() - startTime;
      console.error("\u521B\u5EFA\u4EA7\u54C1\u5931\u8D25:", {
        error: dbError.message,
        product_code,
        time: `${elapsedTime.toFixed(2)}ms`
      });
      return createErrorResponse(500, `\u6570\u636E\u5E93\u64CD\u4F5C\u5931\u8D25: ${dbError.message}`);
    }
  } catch (error) {
    const elapsedTime = performance.now() - startTime;
    console.error("\u521B\u5EFA\u4EA7\u54C1API\u9519\u8BEF:", {
      error: error.message,
      time: `${elapsedTime.toFixed(2)}ms`
    });
    return createErrorResponse(500, "\u521B\u5EFA\u4EA7\u54C1\u5931\u8D25");
  }
}
__name(handleCreateProduct, "handleCreateProduct");
__name2(handleCreateProduct, "handleCreateProduct");
async function handleUpdateProduct(request, env) {
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
    const productId = url.pathname.split("/").pop();
    if (!productId || isNaN(parseInt(productId))) {
      return new Response(JSON.stringify({
        error: { message: "\u65E0\u6548\u7684\u4EA7\u54C1ID" }
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    const body = await request.json();
    const updateFields = [];
    const bindValues = [];
    const processFeatures = /* @__PURE__ */ __name2((features) => {
      if (!features) return "[]";
      if (typeof features === "string") return features;
      if (Array.isArray(features)) return JSON.stringify(features);
      return "[]";
    }, "processFeatures");
    const allowedFields = [
      "product_code",
      "name_zh",
      "name_en",
      "name_ru",
      "description_zh",
      "description_en",
      "description_ru",
      "specifications_zh",
      "specifications_en",
      "specifications_ru",
      "applications_zh",
      "applications_en",
      "applications_ru",
      "packaging_options_zh",
      "packaging_options_en",
      "packaging_options_ru",
      "category",
      "price",
      "price_range",
      "features_zh",
      "features_en",
      "features_ru",
      "image_url",
      "is_active",
      "sort_order"
    ];
    allowedFields.forEach((field) => {
      if (body[field] !== void 0) {
        updateFields.push(`${field} = ?`);
        if (field.startsWith("features_")) {
          bindValues.push(processFeatures(body[field]));
        } else {
          bindValues.push(body[field]);
        }
      }
    });
    if (updateFields.length === 0) {
      return new Response(JSON.stringify({
        error: { message: "\u6CA1\u6709\u9700\u8981\u66F4\u65B0\u7684\u5B57\u6BB5" }
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
      updateFields.push("updated_at = CURRENT_TIMESTAMP");
      bindValues.push(parseInt(productId));
      await env.DB.prepare(`
        UPDATE products SET ${updateFields.join(", ")} WHERE id = ?
      `).bind(...bindValues).run();
      const updatedProduct = await env.DB.prepare(`
        SELECT * FROM products WHERE id = ?
      `).bind(parseInt(productId)).first();
      if (!updatedProduct) {
        return new Response(JSON.stringify({
          error: { message: "\u4EA7\u54C1\u4E0D\u5B58\u5728" }
        }), {
          status: 404,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      }
      return new Response(JSON.stringify({
        data: updatedProduct,
        message: "\u4EA7\u54C1\u66F4\u65B0\u6210\u529F"
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } catch (dbError) {
      console.error("\u66F4\u65B0\u4EA7\u54C1\u5931\u8D25:", dbError);
      return new Response(JSON.stringify({
        error: { message: `\u6570\u636E\u5E93\u64CD\u4F5C\u5931\u8D25: ${dbError.message}` }
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  } catch (error) {
    console.error("\u66F4\u65B0\u4EA7\u54C1API\u9519\u8BEF:", error);
    return new Response(JSON.stringify({
      error: { message: "\u66F4\u65B0\u4EA7\u54C1\u5931\u8D25" }
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
__name(handleUpdateProduct, "handleUpdateProduct");
__name2(handleUpdateProduct, "handleUpdateProduct");
async function handleDeleteProduct(request, env) {
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
    const productId = url.pathname.split("/").pop();
    if (!productId || isNaN(parseInt(productId))) {
      return new Response(JSON.stringify({
        error: { message: "\u65E0\u6548\u7684\u4EA7\u54C1ID" }
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
      const product = await env.DB.prepare(`
        SELECT * FROM products WHERE id = ?
      `).bind(parseInt(productId)).first();
      if (!product) {
        return new Response(JSON.stringify({
          error: { message: "\u4EA7\u54C1\u4E0D\u5B58\u5728" }
        }), {
          status: 404,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      }
      await env.DB.prepare(`
        DELETE FROM products WHERE id = ?
      `).bind(parseInt(productId)).run();
      return new Response(JSON.stringify({
        message: "\u4EA7\u54C1\u5220\u9664\u6210\u529F",
        data: { id: parseInt(productId) }
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } catch (dbError) {
      console.error("\u5220\u9664\u4EA7\u54C1\u5931\u8D25:", dbError);
      return new Response(JSON.stringify({
        error: { message: `\u6570\u636E\u5E93\u64CD\u4F5C\u5931\u8D25: ${dbError.message}` }
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  } catch (error) {
    console.error("\u5220\u9664\u4EA7\u54C1API\u9519\u8BEF:", error);
    return new Response(JSON.stringify({
      error: { message: "\u5220\u9664\u4EA7\u54C1\u5931\u8D25" }
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
__name(handleDeleteProduct, "handleDeleteProduct");
__name2(handleDeleteProduct, "handleDeleteProduct");
async function handleGetSingleProduct(request, env) {
  try {
    const url = new URL(request.url);
    const productId = url.pathname.split("/").pop();
    if (!productId || isNaN(parseInt(productId))) {
      return new Response(JSON.stringify({
        error: { message: "\u65E0\u6548\u7684\u4EA7\u54C1ID" }
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
      const product = await env.DB.prepare(`
        SELECT * FROM products WHERE id = ?
      `).bind(parseInt(productId)).first();
      if (!product) {
        return new Response(JSON.stringify({
          error: { message: "\u4EA7\u54C1\u4E0D\u5B58\u5728" }
        }), {
          status: 404,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      }
      return new Response(JSON.stringify({
        data: product
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } catch (dbError) {
      console.error("\u67E5\u8BE2\u4EA7\u54C1\u5931\u8D25:", dbError);
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
    console.error("\u83B7\u53D6\u4EA7\u54C1API\u9519\u8BEF:", error);
    return new Response(JSON.stringify({
      error: { message: "\u83B7\u53D6\u4EA7\u54C1\u5931\u8D25" }
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
__name(handleGetSingleProduct, "handleGetSingleProduct");
__name2(handleGetSingleProduct, "handleGetSingleProduct");
async function handleUpdateContact(request, env) {
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
    const contactId = url.pathname.split("/").pop();
    if (!contactId || isNaN(parseInt(contactId))) {
      return new Response(JSON.stringify({
        error: { message: "\u65E0\u6548\u7684\u8054\u7CFB\u6D88\u606FID" }
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    const body = await request.json();
    const updateFields = [];
    const bindValues = [];
    const allowedFields = ["status", "is_read"];
    allowedFields.forEach((field) => {
      if (body[field] !== void 0) {
        updateFields.push(`${field} = ?`);
        bindValues.push(body[field]);
      }
    });
    if (updateFields.length === 0) {
      return new Response(JSON.stringify({
        error: { message: "\u6CA1\u6709\u9700\u8981\u66F4\u65B0\u7684\u5B57\u6BB5" }
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
      updateFields.push("updated_at = CURRENT_TIMESTAMP");
      bindValues.push(parseInt(contactId));
      await env.DB.prepare(`
        UPDATE contacts SET ${updateFields.join(", ")} WHERE id = ?
      `).bind(...bindValues).run();
      const updatedContact = await env.DB.prepare(`
        SELECT * FROM contacts WHERE id = ?
      `).bind(parseInt(contactId)).first();
      if (!updatedContact) {
        return new Response(JSON.stringify({
          error: { message: "\u8054\u7CFB\u6D88\u606F\u4E0D\u5B58\u5728" }
        }), {
          status: 404,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      }
      return new Response(JSON.stringify({
        data: updatedContact,
        message: "\u8054\u7CFB\u6D88\u606F\u66F4\u65B0\u6210\u529F"
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } catch (dbError) {
      console.error("\u66F4\u65B0\u8054\u7CFB\u6D88\u606F\u5931\u8D25:", dbError);
      return new Response(JSON.stringify({
        error: { message: `\u6570\u636E\u5E93\u64CD\u4F5C\u5931\u8D25: ${dbError.message}` }
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  } catch (error) {
    console.error("\u66F4\u65B0\u8054\u7CFB\u6D88\u606FAPI\u9519\u8BEF:", error);
    return new Response(JSON.stringify({
      error: { message: "\u66F4\u65B0\u8054\u7CFB\u6D88\u606F\u5931\u8D25" }
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
__name(handleUpdateContact, "handleUpdateContact");
__name2(handleUpdateContact, "handleUpdateContact");
async function handleDeleteContact(request, env) {
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
    const contactId = url.pathname.split("/").pop();
    if (!contactId || isNaN(parseInt(contactId))) {
      return new Response(JSON.stringify({
        error: { message: "\u65E0\u6548\u7684\u8054\u7CFB\u6D88\u606FID" }
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
      const contact = await env.DB.prepare(`
        SELECT * FROM contacts WHERE id = ?
      `).bind(parseInt(contactId)).first();
      if (!contact) {
        return new Response(JSON.stringify({
          error: { message: "\u8054\u7CFB\u6D88\u606F\u4E0D\u5B58\u5728" }
        }), {
          status: 404,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      }
      await env.DB.prepare(`
        DELETE FROM contacts WHERE id = ?
      `).bind(parseInt(contactId)).run();
      return new Response(JSON.stringify({
        message: "\u8054\u7CFB\u6D88\u606F\u5220\u9664\u6210\u529F",
        data: { id: parseInt(contactId) }
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } catch (dbError) {
      console.error("\u5220\u9664\u8054\u7CFB\u6D88\u606F\u5931\u8D25:", dbError);
      return new Response(JSON.stringify({
        error: { message: `\u6570\u636E\u5E93\u64CD\u4F5C\u5931\u8D25: ${dbError.message}` }
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  } catch (error) {
    console.error("\u5220\u9664\u8054\u7CFB\u6D88\u606FAPI\u9519\u8BEF:", error);
    return new Response(JSON.stringify({
      error: { message: "\u5220\u9664\u8054\u7CFB\u6D88\u606F\u5931\u8D25" }
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
__name(handleDeleteContact, "handleDeleteContact");
__name2(handleDeleteContact, "handleDeleteContact");
async function handleGetContents(request, env) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page")) || 1;
    const limit = parseInt(url.searchParams.get("limit")) || 20;
    const pageKey = url.searchParams.get("page_key");
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
      let whereClause = "";
      let bindParams = [limit, offset];
      if (pageKey) {
        whereClause = "WHERE page_key = ?";
        bindParams = [pageKey, limit, offset];
      }
      const contents = await env.DB.prepare(`
        SELECT * FROM page_contents 
        ${whereClause}
        ORDER BY page_key ASC, sort_order ASC, created_at DESC 
        LIMIT ? OFFSET ?
      `).bind(...bindParams).all();
      const countQuery = pageKey ? "SELECT COUNT(*) as total FROM page_contents WHERE page_key = ?" : "SELECT COUNT(*) as total FROM page_contents";
      const countParams = pageKey ? [pageKey] : [];
      const countResult = await env.DB.prepare(countQuery).bind(...countParams).first();
      return new Response(JSON.stringify({
        data: contents.results || [],
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
    console.error("\u83B7\u53D6\u5185\u5BB9\u6570\u636E\u9519\u8BEF:", error);
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
__name(handleGetContents, "handleGetContents");
__name2(handleGetContents, "handleGetContents");
async function handleUpdateContent(request, env) {
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
    const contentId = url.pathname.split("/").pop();
    if (!contentId || isNaN(parseInt(contentId))) {
      return new Response(JSON.stringify({
        error: { message: "\u65E0\u6548\u7684\u5185\u5BB9ID" }
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    const body = await request.json();
    const updateFields = [];
    const bindValues = [];
    const allowedFields = [
      "content_zh",
      "content_en",
      "content_ru",
      "content_type",
      "meta_data",
      "category",
      "tags",
      "is_active",
      "sort_order",
      "meta_title_zh",
      "meta_title_en",
      "meta_title_ru",
      "meta_description_zh",
      "meta_description_en",
      "meta_description_ru"
    ];
    allowedFields.forEach((field) => {
      if (body[field] !== void 0) {
        updateFields.push(`${field} = ?`);
        bindValues.push(body[field]);
      }
    });
    if (updateFields.length === 0) {
      return new Response(JSON.stringify({
        error: { message: "\u6CA1\u6709\u9700\u8981\u66F4\u65B0\u7684\u5B57\u6BB5" }
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
      updateFields.push("updated_at = CURRENT_TIMESTAMP");
      bindValues.push(parseInt(contentId));
      await env.DB.prepare(`
        UPDATE page_contents SET ${updateFields.join(", ")} WHERE id = ?
      `).bind(...bindValues).run();
      const updatedContent = await env.DB.prepare(`
        SELECT * FROM page_contents WHERE id = ?
      `).bind(parseInt(contentId)).first();
      if (!updatedContent) {
        return new Response(JSON.stringify({
          error: { message: "\u5185\u5BB9\u4E0D\u5B58\u5728" }
        }), {
          status: 404,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      }
      return new Response(JSON.stringify({
        data: updatedContent,
        message: "\u5185\u5BB9\u66F4\u65B0\u6210\u529F"
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } catch (dbError) {
      console.error("\u66F4\u65B0\u5185\u5BB9\u5931\u8D25:", dbError);
      return new Response(JSON.stringify({
        error: { message: `\u6570\u636E\u5E93\u64CD\u4F5C\u5931\u8D25: ${dbError.message}` }
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  } catch (error) {
    console.error("\u66F4\u65B0\u5185\u5BB9API\u9519\u8BEF:", error);
    return new Response(JSON.stringify({
      error: { message: "\u66F4\u65B0\u5185\u5BB9\u5931\u8D25" }
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
__name(handleUpdateContent, "handleUpdateContent");
__name2(handleUpdateContent, "handleUpdateContent");
async function handlePublicProducts(request, env) {
  try {
    if (!env.DB) {
      return new Response(JSON.stringify({
        success: false,
        message: "D1\u6570\u636E\u5E93\u672A\u914D\u7F6E"
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    try {
      const rawProducts = await env.DB.prepare(`
        SELECT id, product_code, name_zh, name_en, name_ru,
               description_zh, description_en, description_ru,
               image_url, gallery_images,
               category, price_range, status, is_active,
               sort_order, created_at, updated_at,
               features_zh, features_en, features_ru,
               specifications_zh, specifications_en, specifications_ru
        FROM products
        WHERE is_active = 1 AND status = 'published'
        ORDER BY sort_order ASC, created_at DESC
      `).all();
      const parseList = /* @__PURE__ */ __name2((value, fallback = []) => {
        if (!value) return fallback;
        if (Array.isArray(value)) return value;
        if (typeof value === "string") {
          const trimmed = value.trim();
          if (!trimmed) return fallback;
          try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) {
              return parsed;
            }
          } catch (_) {
            return trimmed.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
          }
        }
        return fallback;
      }, "parseList");
      const products = (rawProducts.results || []).map((product) => ({
        ...product,
        gallery_images: parseList(product.gallery_images, product.image_url ? [product.image_url] : []),
        features_zh: parseList(product.features_zh),
        features_en: parseList(product.features_en),
        features_ru: parseList(product.features_ru),
        specifications_zh: parseList(product.specifications_zh),
        specifications_en: parseList(product.specifications_en),
        specifications_ru: parseList(product.specifications_ru)
      }));
      return new Response(JSON.stringify({
        success: true,
        data: products
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
        success: false,
        message: `\u6570\u636E\u5E93\u67E5\u8BE2\u5931\u8D25: ${dbError.message}`
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  } catch (error) {
    console.error("\u83B7\u53D6\u516C\u5F00\u4EA7\u54C1\u6570\u636E\u9519\u8BEF:", error);
    return new Response(JSON.stringify({
      success: false,
      message: "\u83B7\u53D6\u4EA7\u54C1\u6570\u636E\u5931\u8D25"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
__name(handlePublicProducts, "handlePublicProducts");
__name2(handlePublicProducts, "handlePublicProducts");
async function handleDashboardStats(request, env) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return createAuthError();
    }
    if (!env.DB) {
      return createErrorResponse(500, "D1\u6570\u636E\u5E93\u672A\u914D\u7F6E");
    }
    try {
      const [
        totalProducts,
        totalContacts,
        unreadContacts,
        activeProducts,
        recentActivities
      ] = await Promise.all([
        // 产品总数
        env.DB.prepare(`SELECT COUNT(*) as count FROM products`).first(),
        // 联系消息总数
        env.DB.prepare(`SELECT COUNT(*) as count FROM contacts`).first(),
        // 未读联系消息
        env.DB.prepare(`SELECT COUNT(*) as count FROM contacts WHERE is_read = 0`).first(),
        // 活跃产品数
        env.DB.prepare(`SELECT COUNT(*) as count FROM products WHERE is_active = 1`).first(),
        // 最近7天活动数
        env.DB.prepare(`
          SELECT COUNT(*) as count FROM contacts
          WHERE created_at >= datetime('now', '-7 days')
        `).first()
      ]);
      const dailyContacts = await env.DB.prepare(`
        SELECT
          date(created_at) as date,
          COUNT(*) as count
        FROM contacts
        WHERE created_at >= datetime('now', '-30 days')
        GROUP BY date(created_at)
        ORDER BY date
      `).all();
      const categoryStats = await env.DB.prepare(`
        SELECT
          category,
          COUNT(*) as count
        FROM products
        WHERE is_active = 1
        GROUP BY category
        ORDER BY count DESC
      `).all();
      return new Response(JSON.stringify({
        data: {
          totalProducts: totalProducts?.count || 0,
          totalContacts: totalContacts?.count || 0,
          unreadContacts: unreadContacts?.count || 0,
          activeProducts: activeProducts?.count || 0,
          recentActivities: recentActivities?.count || 0,
          dailyContacts: dailyContacts.results || [],
          categoryStats: categoryStats.results || []
        },
        meta: {
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-cache"
        }
      });
    } catch (dbError) {
      console.error("\u4EEA\u8868\u677F\u7EDF\u8BA1\u67E5\u8BE2\u5931\u8D25:", dbError);
      return createErrorResponse(500, `\u6570\u636E\u5E93\u67E5\u8BE2\u5931\u8D25: ${dbError.message}`);
    }
  } catch (error) {
    console.error("\u4EEA\u8868\u677F\u7EDF\u8BA1API\u9519\u8BEF:", error);
    return createErrorResponse(500, "\u83B7\u53D6\u4EEA\u8868\u677F\u7EDF\u8BA1\u5931\u8D25");
  }
}
__name(handleDashboardStats, "handleDashboardStats");
__name2(handleDashboardStats, "handleDashboardStats");
async function handleDashboardActivities(request, env) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return createAuthError();
    }
    const url = new URL(request.url);
    const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get("limit") || "20")));
    if (!env.DB) {
      return createErrorResponse(500, "D1\u6570\u636E\u5E93\u672A\u914D\u7F6E");
    }
    try {
      const recentContacts = await env.DB.prepare(`
        SELECT
          id, name, email, created_at, status, is_read,
          'contact' as type
        FROM contacts
        ORDER BY created_at DESC
        LIMIT ?
      `).bind(limit).all();
      const recentProducts = await env.DB.prepare(`
        SELECT
          id, product_code, name_zh, updated_at,
          'product' as type
        FROM products
        WHERE updated_at IS NOT NULL
        ORDER BY updated_at DESC
        LIMIT ?
      `).bind(limit).all();
      const allActivities = [
        ...(recentContacts.results || []).map((item) => ({
          ...item,
          timestamp: item.created_at
        })),
        ...(recentProducts.results || []).map((item) => ({
          ...item,
          timestamp: item.updated_at
        }))
      ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, limit);
      return new Response(JSON.stringify({
        data: allActivities,
        pagination: {
          limit,
          total: allActivities.length
        },
        meta: {
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-cache"
        }
      });
    } catch (dbError) {
      console.error("\u4EEA\u8868\u677F\u6D3B\u52A8\u67E5\u8BE2\u5931\u8D25:", dbError);
      return createErrorResponse(500, `\u6570\u636E\u5E93\u67E5\u8BE2\u5931\u8D25: ${dbError.message}`);
    }
  } catch (error) {
    console.error("\u4EEA\u8868\u677F\u6D3B\u52A8API\u9519\u8BEF:", error);
    return createErrorResponse(500, "\u83B7\u53D6\u4EEA\u8868\u677F\u6D3B\u52A8\u5931\u8D25");
  }
}
__name(handleDashboardActivities, "handleDashboardActivities");
__name2(handleDashboardActivities, "handleDashboardActivities");
async function handleDashboardHealth(request, env) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return createAuthError();
    }
    try {
      const healthData = {
        database: {
          status: env.DB ? "connected" : "not_configured",
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        },
        storage: {
          status: env.IMAGE_BUCKET ? "configured" : "not_configured",
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        },
        system: {
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        },
        environment: {
          node_env: "undefined",
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }
      };
      return new Response(JSON.stringify({
        data: healthData,
        meta: {
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-cache"
        }
      });
    } catch (error) {
      console.error("\u7CFB\u7EDF\u5065\u5EB7\u68C0\u67E5\u5931\u8D25:", error);
      return createErrorResponse(500, `\u7CFB\u7EDF\u5065\u5EB7\u68C0\u67E5\u5931\u8D25: ${error.message}`);
    }
  } catch (error) {
    console.error("\u4EEA\u8868\u677F\u5065\u5EB7API\u9519\u8BEF:", error);
    return createErrorResponse(500, "\u83B7\u53D6\u7CFB\u7EDF\u5065\u5EB7\u4FE1\u606F\u5931\u8D25");
  }
}
__name(handleDashboardHealth, "handleDashboardHealth");
__name2(handleDashboardHealth, "handleDashboardHealth");
async function handleCompanyInfo(request, env) {
  try {
    const url = new URL(request.url);
    const section = url.pathname.split("/").pop();
    const language = url.searchParams.get("lang") || "zh";
    if (!env.DB) {
      return createErrorResponse(500, "D1\u6570\u636E\u5E93\u672A\u914D\u7F6E");
    }
    try {
      let query;
      let bindParams;
      if (section === "all") {
        query = "SELECT * FROM company_info WHERE is_active = 1 AND language = ?";
        bindParams = [language];
      } else {
        query = "SELECT * FROM company_info WHERE section_type = ? AND is_active = 1 AND language = ?";
        bindParams = [section, language];
      }
      const result = await env.DB.prepare(query).bind(...bindParams).all();
      return new Response(JSON.stringify({
        success: true,
        data: result.results || []
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=300"
        }
      });
    } catch (dbError) {
      console.error("\u516C\u53F8\u4FE1\u606F\u67E5\u8BE2\u5931\u8D25:", dbError);
      return createErrorResponse(500, "\u6570\u636E\u5E93\u67E5\u8BE2\u5931\u8D25: " + dbError.message);
    }
  } catch (error) {
    console.error("\u516C\u53F8\u4FE1\u606FAPI\u9519\u8BEF:", error);
    return createErrorResponse(500, "\u83B7\u53D6\u516C\u53F8\u4FE1\u606F\u5931\u8D25");
  }
}
__name(handleCompanyInfo, "handleCompanyInfo");
__name2(handleCompanyInfo, "handleCompanyInfo");
async function handleCompanyContent(request, env) {
  try {
    const url = new URL(request.url);
    const type = url.pathname.split("/").pop();
    const language = url.searchParams.get("lang") || "zh";
    if (!env.DB) {
      return createErrorResponse(500, "D1\u6570\u636E\u5E93\u672A\u914D\u7F6E");
    }
    try {
      let query;
      let bindParams;
      if (type === "all") {
        query = "SELECT * FROM company_content WHERE is_active = 1 AND language = ?";
        bindParams = [language];
      } else {
        query = "SELECT * FROM company_content WHERE content_type = ? AND is_active = 1 AND language = ?";
        bindParams = [type, language];
      }
      const result = await env.DB.prepare(query).bind(...bindParams).all();
      return new Response(JSON.stringify({
        success: true,
        data: result.results || []
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=300"
        }
      });
    } catch (dbError) {
      console.error("\u516C\u53F8\u5185\u5BB9\u67E5\u8BE2\u5931\u8D25:", dbError);
      return createErrorResponse(500, "\u6570\u636E\u5E93\u67E5\u8BE2\u5931\u8D25: " + dbError.message);
    }
  } catch (error) {
    console.error("\u516C\u53F8\u5185\u5BB9API\u9519\u8BEF:", error);
    return createErrorResponse(500, "\u83B7\u53D6\u516C\u53F8\u5185\u5BB9\u5931\u8D25");
  }
}
__name(handleCompanyContent, "handleCompanyContent");
__name2(handleCompanyContent, "handleCompanyContent");
async function handleGetPageContent(request, env, pageType) {
  try {
    const url = new URL(request.url);
    const language = url.searchParams.get("lang") || "zh";
    if (!env.DB) {
      return createErrorResponse(500, "D1\u6570\u636E\u5E93\u672A\u914D\u7F6E");
    }
    try {
      const contents = await env.DB.prepare(`
        SELECT id, section_key, content_zh, content_en, content_ru,
               content_type, meta_data, sort_order, created_at, updated_at
        FROM page_contents 
        WHERE page_key = ? AND is_active = 1
        ORDER BY sort_order ASC, created_at DESC
      `).bind(pageType).all();
      const filteredContents = (contents.results || []).map((content) => {
        let displayContent;
        switch (language) {
          case "en":
            displayContent = content.content_en || content.content_zh;
            break;
          case "ru":
            displayContent = content.content_ru || content.content_zh;
            break;
          default:
            displayContent = content.content_zh;
        }
        return {
          id: content.id,
          section_key: content.section_key,
          content: displayContent,
          content_type: content.content_type,
          meta_data: content.meta_data ? JSON.parse(content.meta_data) : {},
          sort_order: content.sort_order,
          created_at: content.created_at,
          updated_at: content.updated_at
        };
      });
      return new Response(JSON.stringify({
        success: true,
        data: filteredContents,
        meta: {
          page: pageType,
          language,
          total: filteredContents.length
        }
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=300"
        }
      });
    } catch (dbError) {
      console.error(`${pageType}\u9875\u9762\u5185\u5BB9\u67E5\u8BE2\u5931\u8D25:`, dbError);
      return createErrorResponse(500, "\u6570\u636E\u5E93\u67E5\u8BE2\u5931\u8D25: " + dbError.message);
    }
  } catch (error) {
    console.error(`${pageType}\u9875\u9762\u5185\u5BB9API\u9519\u8BEF:`, error);
    return createErrorResponse(500, `\u83B7\u53D6${pageType}\u9875\u9762\u5185\u5BB9\u5931\u8D25`);
  }
}
__name(handleGetPageContent, "handleGetPageContent");
__name2(handleGetPageContent, "handleGetPageContent");
async function handleGetAdminPageContent(request, env, pageType) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return createAuthError();
    }
    const url = new URL(request.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get("limit") || "20")));
    const offset = (page - 1) * limit;
    if (!env.DB) {
      return createErrorResponse(500, "D1\u6570\u636E\u5E93\u672A\u914D\u7F6E");
    }
    try {
      const [contentsResult, countResult] = await Promise.all([
        env.DB.prepare(`
          SELECT id, section_key, content_zh, content_en, content_ru,
                 content_type, meta_data, category, tags,
                 is_active, sort_order, created_at, updated_at,
                 meta_title_zh, meta_title_en, meta_title_ru,
                 meta_description_zh, meta_description_en, meta_description_ru
          FROM page_contents 
          WHERE page_key = ?
          ORDER BY sort_order ASC, created_at DESC 
          LIMIT ? OFFSET ?
        `).bind(pageType, limit, offset).all(),
        env.DB.prepare(`SELECT COUNT(*) as total FROM page_contents WHERE page_key = ?`).bind(pageType).first()
      ]);
      return new Response(JSON.stringify({
        success: true,
        data: contentsResult.results || [],
        pagination: {
          page,
          limit,
          total: countResult?.total || 0,
          totalPages: Math.ceil((countResult?.total || 0) / limit)
        },
        meta: {
          page: pageType,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "private, max-age=60"
        }
      });
    } catch (dbError) {
      console.error(`${pageType}\u9875\u9762\u7BA1\u7406\u5185\u5BB9\u67E5\u8BE2\u5931\u8D25:`, dbError);
      return createErrorResponse(500, "\u6570\u636E\u5E93\u67E5\u8BE2\u5931\u8D25: " + dbError.message);
    }
  } catch (error) {
    console.error(`${pageType}\u9875\u9762\u7BA1\u7406\u5185\u5BB9API\u9519\u8BEF:`, error);
    return createErrorResponse(500, `\u83B7\u53D6${pageType}\u9875\u9762\u7BA1\u7406\u5185\u5BB9\u5931\u8D25`);
  }
}
__name(handleGetAdminPageContent, "handleGetAdminPageContent");
__name2(handleGetAdminPageContent, "handleGetAdminPageContent");
async function handleCreatePageContent(request, env, pageType) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return createAuthError();
    }
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return createErrorResponse(400, "\u8BF7\u6C42\u6570\u636E\u683C\u5F0F\u9519\u8BEF");
    }
    const {
      section_key,
      content_zh,
      content_en,
      content_ru,
      content_type = "text",
      meta_data = {},
      category = "",
      tags = "",
      is_active = true,
      sort_order = 0,
      meta_title_zh = "",
      meta_title_en = "",
      meta_title_ru = "",
      meta_description_zh = "",
      meta_description_en = "",
      meta_description_ru = ""
    } = body;
    if (!section_key?.trim() || !content_zh?.trim()) {
      return createErrorResponse(400, "\u8BF7\u586B\u5199\u533A\u57DF\u952E\u548C\u4E2D\u6587\u5185\u5BB9");
    }
    if (!env.DB) {
      return createErrorResponse(500, "D1\u6570\u636E\u5E93\u672A\u914D\u7F6E");
    }
    try {
      const existing = await env.DB.prepare(`
        SELECT id FROM page_contents WHERE page_key = ? AND section_key = ?
      `).bind(pageType, section_key).first();
      if (existing) {
        return createErrorResponse(400, "\u76F8\u540C\u7684\u533A\u57DF\u952E\u5DF2\u5B58\u5728");
      }
      const result = await env.DB.prepare(`
        INSERT INTO page_contents (
          page_key, section_key,
          content_zh, content_en, content_ru,
          content_type, meta_data, category, tags,
          is_active, sort_order,
          meta_title_zh, meta_title_en, meta_title_ru,
          meta_description_zh, meta_description_en, meta_description_ru
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        pageType,
        section_key.trim(),
        content_zh.trim(),
        content_en?.trim() || "",
        content_ru?.trim() || "",
        content_type,
        JSON.stringify(meta_data),
        category.trim(),
        tags.trim(),
        is_active ? 1 : 0,
        sort_order,
        meta_title_zh.trim(),
        meta_title_en.trim(),
        meta_title_ru.trim(),
        meta_description_zh.trim(),
        meta_description_en.trim(),
        meta_description_ru.trim()
      ).run();
      if (!result.meta?.last_row_id) {
        throw new Error("\u5185\u5BB9\u521B\u5EFA\u5931\u8D25\uFF1A\u672A\u83B7\u5F97\u65B0\u5185\u5BB9ID");
      }
      const newContent = await env.DB.prepare(`
        SELECT * FROM page_contents WHERE id = ?
      `).bind(result.meta.last_row_id).first();
      console.log(`\u2705 ${pageType}\u9875\u9762\u5185\u5BB9\u521B\u5EFA\u6210\u529F:`, {
        id: result.meta.last_row_id,
        section_key
      });
      return new Response(JSON.stringify({
        success: true,
        data: newContent,
        message: `${pageType}\u9875\u9762\u5185\u5BB9\u521B\u5EFA\u6210\u529F`,
        meta: {
          page: pageType,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }
      }), {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-cache"
        }
      });
    } catch (dbError) {
      console.error(`\u521B\u5EFA${pageType}\u9875\u9762\u5185\u5BB9\u5931\u8D25:`, dbError);
      return createErrorResponse(500, `\u6570\u636E\u5E93\u64CD\u4F5C\u5931\u8D25: ${dbError.message}`);
    }
  } catch (error) {
    console.error(`\u521B\u5EFA${pageType}\u9875\u9762\u5185\u5BB9API\u9519\u8BEF:`, error);
    return createErrorResponse(500, `\u521B\u5EFA${pageType}\u9875\u9762\u5185\u5BB9\u5931\u8D25`);
  }
}
__name(handleCreatePageContent, "handleCreatePageContent");
__name2(handleCreatePageContent, "handleCreatePageContent");
async function handleUpdatePageContent(request, env, pageType) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return createAuthError();
    }
    const url = new URL(request.url);
    const contentId = url.pathname.split("/").pop();
    if (!contentId || isNaN(parseInt(contentId))) {
      return createErrorResponse(400, "\u65E0\u6548\u7684\u5185\u5BB9ID");
    }
    const body = await request.json();
    const updateFields = [];
    const bindValues = [];
    const allowedFields = [
      "section_key",
      "content_zh",
      "content_en",
      "content_ru",
      "content_type",
      "meta_data",
      "category",
      "tags",
      "is_active",
      "sort_order",
      "meta_title_zh",
      "meta_title_en",
      "meta_title_ru",
      "meta_description_zh",
      "meta_description_en",
      "meta_description_ru"
    ];
    allowedFields.forEach((field) => {
      if (body[field] !== void 0) {
        updateFields.push(`${field} = ?`);
        if (field === "meta_data") {
          bindValues.push(JSON.stringify(body[field]));
        } else {
          bindValues.push(body[field]);
        }
      }
    });
    if (updateFields.length === 0) {
      return createErrorResponse(400, "\u6CA1\u6709\u9700\u8981\u66F4\u65B0\u7684\u5B57\u6BB5");
    }
    if (!env.DB) {
      return createErrorResponse(500, "D1\u6570\u636E\u5E93\u672A\u914D\u7F6E");
    }
    try {
      const existingContent = await env.DB.prepare(`
        SELECT * FROM page_contents WHERE id = ? AND page_key = ?
      `).bind(parseInt(contentId), pageType).first();
      if (!existingContent) {
        return createErrorResponse(404, `${pageType}\u9875\u9762\u4E2D\u672A\u627E\u5230\u6307\u5B9A\u5185\u5BB9`);
      }
      updateFields.push("updated_at = CURRENT_TIMESTAMP");
      bindValues.push(parseInt(contentId));
      await env.DB.prepare(`
        UPDATE page_contents SET ${updateFields.join(", ")} WHERE id = ?
      `).bind(...bindValues).run();
      const updatedContent = await env.DB.prepare(`
        SELECT * FROM page_contents WHERE id = ?
      `).bind(parseInt(contentId)).first();
      return new Response(JSON.stringify({
        success: true,
        data: updatedContent,
        message: `${pageType}\u9875\u9762\u5185\u5BB9\u66F4\u65B0\u6210\u529F`,
        meta: {
          page: pageType,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-cache"
        }
      });
    } catch (dbError) {
      console.error(`\u66F4\u65B0${pageType}\u9875\u9762\u5185\u5BB9\u5931\u8D25:`, dbError);
      return createErrorResponse(500, `\u6570\u636E\u5E93\u64CD\u4F5C\u5931\u8D25: ${dbError.message}`);
    }
  } catch (error) {
    console.error(`\u66F4\u65B0${pageType}\u9875\u9762\u5185\u5BB9API\u9519\u8BEF:`, error);
    return createErrorResponse(500, `\u66F4\u65B0${pageType}\u9875\u9762\u5185\u5BB9\u5931\u8D25`);
  }
}
__name(handleUpdatePageContent, "handleUpdatePageContent");
__name2(handleUpdatePageContent, "handleUpdatePageContent");
async function handleDeletePageContent(request, env, pageType) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return createAuthError();
    }
    const url = new URL(request.url);
    const contentId = url.pathname.split("/").pop();
    if (!contentId || isNaN(parseInt(contentId))) {
      return createErrorResponse(400, "\u65E0\u6548\u7684\u5185\u5BB9ID");
    }
    if (!env.DB) {
      return createErrorResponse(500, "D1\u6570\u636E\u5E93\u672A\u914D\u7F6E");
    }
    try {
      const content = await env.DB.prepare(`
        SELECT * FROM page_contents WHERE id = ? AND page_key = ?
      `).bind(parseInt(contentId), pageType).first();
      if (!content) {
        return createErrorResponse(404, `${pageType}\u9875\u9762\u4E2D\u672A\u627E\u5230\u6307\u5B9A\u5185\u5BB9`);
      }
      await env.DB.prepare(`
        DELETE FROM page_contents WHERE id = ?
      `).bind(parseInt(contentId)).run();
      return new Response(JSON.stringify({
        success: true,
        message: `${pageType}\u9875\u9762\u5185\u5BB9\u5220\u9664\u6210\u529F`,
        data: { id: parseInt(contentId) },
        meta: {
          page: pageType,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-cache"
        }
      });
    } catch (dbError) {
      console.error(`\u5220\u9664${pageType}\u9875\u9762\u5185\u5BB9\u5931\u8D25:`, dbError);
      return createErrorResponse(500, `\u6570\u636E\u5E93\u64CD\u4F5C\u5931\u8D25: ${dbError.message}`);
    }
  } catch (error) {
    console.error(`\u5220\u9664${pageType}\u9875\u9762\u5185\u5BB9API\u9519\u8BEF:`, error);
    return createErrorResponse(500, `\u5220\u9664${pageType}\u9875\u9762\u5185\u5BB9\u5931\u8D25`);
  }
}
__name(handleDeletePageContent, "handleDeletePageContent");
__name2(handleDeletePageContent, "handleDeletePageContent");
async function handleGetSingleProductByCode(request, env, productCode) {
  try {
    if (!env.DB) {
      return createErrorResponse(500, "D1\u6570\u636E\u5E93\u672A\u914D\u7F6E");
    }
    try {
      const product = await env.DB.prepare(`
        SELECT id, product_code, name_zh, name_en, name_ru,
               description_zh, description_en, description_ru,
               image_url, gallery_images,
               category, price_range, status, is_active,
               sort_order, created_at, updated_at,
               features_zh, features_en, features_ru,
               specifications_zh, specifications_en, specifications_ru
        FROM products
        WHERE product_code = ? AND is_active = 1 AND status = 'published'
      `).bind(productCode).first();
      if (!product) {
        return new Response(JSON.stringify({
          success: false,
          message: "\u4EA7\u54C1\u4E0D\u5B58\u5728\u6216\u5DF2\u505C\u7528"
        }), {
          status: 404,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      }
      const parseList = /* @__PURE__ */ __name2((value, fallback = []) => {
        if (!value) return fallback;
        if (Array.isArray(value)) return value;
        if (typeof value === "string") {
          const trimmed = value.trim();
          if (!trimmed) return fallback;
          try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) {
              return parsed;
            }
          } catch (_) {
            return trimmed.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
          }
        }
        return fallback;
      }, "parseList");
      const normalizedProduct = {
        ...product,
        gallery_images: parseList(product.gallery_images, product.image_url ? [product.image_url] : []),
        features_zh: parseList(product.features_zh),
        features_en: parseList(product.features_en),
        features_ru: parseList(product.features_ru),
        specifications_zh: parseList(product.specifications_zh),
        specifications_en: parseList(product.specifications_en),
        specifications_ru: parseList(product.specifications_ru)
      };
      return new Response(JSON.stringify({
        success: true,
        data: normalizedProduct
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } catch (dbError) {
      console.error("\u901A\u8FC7\u4EA7\u54C1\u4EE3\u7801\u67E5\u8BE2\u4EA7\u54C1\u5931\u8D25:", dbError);
      return createErrorResponse(500, `\u6570\u636E\u5E93\u67E5\u8BE2\u5931\u8D25: ${dbError.message}`);
    }
  } catch (error) {
    console.error("\u901A\u8FC7\u4EA7\u54C1\u4EE3\u7801\u83B7\u53D6\u4EA7\u54C1API\u9519\u8BEF:", error);
    return createErrorResponse(500, "\u83B7\u53D6\u4EA7\u54C1\u5931\u8D25");
  }
}
__name(handleGetSingleProductByCode, "handleGetSingleProductByCode");
__name2(handleGetSingleProductByCode, "handleGetSingleProductByCode");
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

// ../../.npm-global/lib/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
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

// ../../.npm-global/lib/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
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

// .wrangler/tmp/bundle-Xbr3Da/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__2 = [
  middleware_ensure_req_body_drained_default2,
  middleware_miniflare3_json_error_default2
];
var middleware_insertion_facade_default2 = middleware_loader_entry_default;

// ../../.npm-global/lib/node_modules/wrangler/templates/middleware/common.ts
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

// .wrangler/tmp/bundle-Xbr3Da/middleware-loader.entry.ts
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
//# sourceMappingURL=bundledWorker-0.5102207708433102.js.map
