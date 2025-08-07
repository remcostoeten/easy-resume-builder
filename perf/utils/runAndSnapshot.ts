import { mkdir } from "node:fs/promises";

// Months in short, lowercase form to match existing convention
const MONTHS = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

type TProps = {
  cmd: string[];
  subDir: string;
};

export async function runAndSnapshot(cmd: string[], subDir: string): Promise<number> {
  // Derive command label and name from the provided command array
  const { label, name } = getCommandLabelAndName(cmd);

  // Ensure target directory exists: perf/<subDir>/
  const dir = `perf/${subDir}`;
  await mkdir(dir, { recursive: true });

  // Build filename using existing convention: {command-name}-{dd}-{mon}-{HH}:{MM}.txt
  const now = new Date();
  const dd = String(now.getDate()); // no leading zero per convention (e.g., 7-aug)
  const mon = MONTHS[now.getMonth()];
  const HH = String(now.getHours()).padStart(2, "0");
  const MM = String(now.getMinutes()).padStart(2, "0");
  const filename = `${name}-${dd}-${mon}-${HH}:${MM}.txt`;
  const filepath = `${dir}/${filename}`;

  // Spawn the process, stream live to console, and capture combined output
  const proc = Bun.spawn({ cmd, stdout: "pipe", stderr: "pipe" });

  const chunks: Uint8Array[] = [];

  const pump = async (
    stream: ReadableStream<Uint8Array> | null,
    writer: (chunk: Uint8Array) => Promise<number>
  ) => {
    if (!stream) return;
    const reader = stream.getReader();
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (value) {
        chunks.push(value);
        await writer(value);
      }
    }
  };

  await Promise.all([
    pump(proc.stdout, (c) => Bun.stdout.write(c)),
    pump(proc.stderr, (c) => Bun.stderr.write(c)),
  ]);

  // Wait for process exit to get exit code
  const exitCode = await proc.exited;

  // Combine captured output
  const totalLen = chunks.reduce((n, c) => n + c.byteLength, 0);
  const buf = new Uint8Array(totalLen);
  let offset = 0;
  for (const c of chunks) {
    buf.set(c, offset);
    offset += c.byteLength;
  }
  const combinedOutput = new TextDecoder().decode(buf);

  // Prepare two-line header + combined output
  const fullCommand = cmd.join(" ");
  const header = `${label}\n$ ${fullCommand}\n`;
  const snapshotContent = header + combinedOutput;

  // Write snapshot file
  await Bun.write(filepath, snapshotContent);

  return exitCode;
}

function getCommandLabelAndName(cmd: string[]): { label: string; name: string } {
  // Default label and name from the executable (basename) when not a bun run script
  const exe = cmd[0] ?? "";
  const base = exe.split("/").pop() ?? exe;

  // Detect `bun run <script>` pattern to match existing conventions
  const runIdx = cmd.findIndex((x) => x === "run");
  if (base === "bun" && runIdx !== -1 && cmd.length > runIdx + 1) {
    const script = cmd[runIdx + 1];
    const label = `bun ${script}`; // e.g., "bun build:analyze"
    const name = script.replace(/:/g, "-"); // e.g., "build-analyze"
    return { label, name };
  }

  // Otherwise, use the executable as label and a sanitized name for the file
  const label = base; // e.g., "next"
  const name = base.replace(/[^a-zA-Z0-9._-]+/g, "-");
  return { label, name };
}

