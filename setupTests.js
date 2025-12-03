import '@testing-library/jest-dom';
import '@testing-library/jest-dom';
import fetch, { Headers, Request, Response } from 'cross-fetch';
if (!globalThis.fetch)
    globalThis.fetch = fetch;
if (!globalThis.Headers)
    globalThis.Headers = Headers;
if (!globalThis.Request)
    globalThis.Request = Request;
if (!globalThis.Response)
    globalThis.Response = Response;
