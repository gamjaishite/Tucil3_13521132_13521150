export async function GET(request: Request) {
  return new Response("Hello, Next.js!");
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request) {
  const data = await request.formData();
  const result = data.get("file")!;
  var file = new File([result], "new_file");
  console.log(file);
  return new Response("OK");
}
