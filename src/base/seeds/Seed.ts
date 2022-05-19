import * as api from '@app/api';
import type { Config } from '@app/config';
import * as proj from "@app/project";
import { isDomain } from '@app/utils';
import { assert } from '@app/error';

export class InvalidSeed {
  valid: false = false;

  host?: api.Host;
  id?: string;

  constructor(host?: string, id?: string) {
    if (host) {
      this.host = { host, port: null };
    }
    this.id = id;
  }
}

export class Seed {
  valid: true = true;

  api: { host: string; port: number | null };
  git: { host: string; port: number | null };
  link: { host: string; id: string; port: number };

  path: string;
  version?: string;
  emoji: string;

  constructor(seed: {
    host: string;
    port?: number;
    id: string;
    git?: string | null;
    api?: string | null;
    version?: string | null;
  }, cfg: Config) {
    assert(isDomain(seed.host), `invalid seed host: ${seed.host}`);
    assert(/^[a-z0-9]+$/.test(seed.id), `invalid seed id ${seed.id}`);

    let api = null;
    let git = null;
    let apiPort: number | null = seed.port || cfg.seed.api.port;
    let gitPort: number | null = cfg.seed.git.port;

    if (seed.api) {
      try {
        const url = new URL(seed.api);
        api = url.hostname;
        apiPort = url.port ? Number(url.port) : null;
      } catch {
        api = seed.api;
      }
      assert(isDomain(api), `invalid seed api host ${api}`);
    }

    if (seed.git) {
      try {
        const url = new URL(seed.git);
        git = url.hostname;
        gitPort = url.port ? Number(url.port) : null;
      } catch {
        git = seed.git;
      }
      assert(isDomain(git), `invalid seed git host ${git}`);
    }

    const meta = cfg.seeds.pinned[seed.host];
    if (meta) {
      this.emoji = meta.emoji;
    } else {
      this.emoji = "🌱";
    }

    // The `git` and `api` keys being more specific take
    // precedence over the `host`, if available.
    api = api ?? seed.host;
    git = git ?? seed.host;

    this.api = { host: api, port: apiPort };
    this.git = { host: git, port: gitPort };
    this.link = { host: seed.host, id: seed.id, port: cfg.seed.link.port };

    if (seed.version) {
      this.version = seed.version;
    }

    this.path = this.api.port === cfg.seed.api.port
      ? `/seeds/${this.api.host}`
      : `/seeds/${this.api.host}/${this.api.port}`;
  }

  get id(): string {
    return this.link.id;
  }

  get host(): api.Host {
    return { host: this.api.host, port: this.api.port };
  }

  async getPeer(): Promise<{ id: string }> {
    return Seed.getPeer(this.api);
  }

  async getProject(urn: string): Promise<proj.ProjectInfo> {
    return proj.Project.getInfo(urn, this.api);
  }

  async getProjects(id?: string): Promise<proj.ProjectInfo[]> {
    const result = id
      ? await proj.Project.getDelegateProjects(id, this.api)
      : await proj.Project.getProjects(this.api);

    return result.map((project: proj.ProjectInfo) => ({ ...project, id: project.urn }));
  }

  static async getPeer({ host, port }: api.Host): Promise<{ id: string }> {
    return api.get("/peer", {}, { host, port });
  }

  static async getInfo({ host, port }: api.Host): Promise<{ version: string }> {
    return api.get("/", {}, { host, port });
  }

  static async lookup(host: api.Host, cfg: Config): Promise<Seed> {
    const [info, peer] = await Promise.all([
      Seed.getInfo(host),
      Seed.getPeer(host),
    ]);

    const settings: any = {
      host: host.host,
      id: peer.id,
      version: info.version,
    };

    if (host.port) {
      settings.port = host.port;
    }
    return new Seed(settings, cfg);
  }

  static async lookupMulti(hosts: api.Host[], cfg: Config): Promise<Seed[]> {
    return await Promise.all(hosts.map(h => Seed.lookup(h, cfg)));
  }
}
