import '@testing-library/jest-dom';

import '@testing-library/jest-dom';
import fetch, { Headers, Request, Response } from 'cross-fetch';

if (!globalThis.fetch) (globalThis as any).fetch = fetch;
if (!globalThis.Headers) (globalThis as any).Headers = Headers;
if (!globalThis.Request) (globalThis as any).Request = Request;
if (!globalThis.Response) (globalThis as any).Response = Response;