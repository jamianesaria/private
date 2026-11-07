// Small compatibility surface for the existing private form handler.
// The backup Worker deliberately does not load the Next.js rendering server.
export class NextRequest extends Request {
  get nextUrl() { return new URL(this.url); }
}

export const NextResponse = {
  json(value: unknown, init?: ResponseInit) { return Response.json(value, init); },
};
