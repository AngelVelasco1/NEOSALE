// frontend/app/api/backend/[...path]/route.ts
// Este archivo actúa como proxy hacia el backend
// Las solicitudes a /api/backend/* se redirigen a la URL del backend

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 
  (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8000');

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const pathStr = path.join("/");
  const url = new URL(request.url);
  const query = url.search;

  try {
    const response = await fetch(
      `${BACKEND_URL}/api/${pathStr}${query}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error("Backend proxy error:", error);
    return Response.json(
      { error: "Backend error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const pathStr = path.join("/");
  const body = await request.json();

  try {
    const response = await fetch(
      `${BACKEND_URL}/api/${pathStr}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error("Backend proxy error:", error);
    return Response.json(
      { error: "Backend error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const pathStr = path.join("/");
  const body = await request.json();

  try {
    const response = await fetch(
      `${BACKEND_URL}/api/${pathStr}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error("Backend proxy error:", error);
    return Response.json(
      { error: "Backend error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const pathStr = path.join("/");

  try {
    const response = await fetch(
      `${BACKEND_URL}/api/${pathStr}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error("Backend proxy error:", error);
    return Response.json(
      { error: "Backend error" },
      { status: 500 }
    );
  }
}
