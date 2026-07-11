declare module 'streamsaver' {
  interface StreamSaver {
    createWriteStream(filename: string, options?: { size?: number }): WritableStream<Uint8Array>;
    WritableStream: new (underlyingSink?: UnderlyingSink<Uint8Array>, strategy?: QueuingStrategy<Uint8Array>) => WritableStream<Uint8Array>;
    mitm: string;
    supported: boolean;
    version: { full: string; major: number; minor: number; dot: number };
  }
  const streamSaver: StreamSaver;
  export default streamSaver;
}
