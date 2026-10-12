const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, options);
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.blob();

  if (!response.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return { data };
}

const api = {
  async get(path) {
    return request(path);
  },

  async post(path, payload) {
    if (payload instanceof FormData) {
      return request(path, { method: "POST", body: payload });
    }
    return request(path, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(payload)
    });
  },

  async put(path, payload) {
    return request(path, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(payload)
    });
  },

  async patch(path, payload) {
    return request(path, {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(payload || {})
    });
  },

  async delete(path) {
    return request(path, { method: "DELETE" });
  }
};

export default api;
