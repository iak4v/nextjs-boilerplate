import { attribute } from "dynamode"
import { Entity, EntityKey, EntityProps, EntityTableManager } from "@/db";
import { slugify, uuid } from "@/lib";

export enum PostAuthorization {
    True = 'true',
    False = 'false'
}

export enum PostVisibility {
    Public = 'public',
    Private = 'private',
    Blacklist = 'blacklist'
}

type PostProps = {
    id?: string,
    title: string,
    content: string,
    cover_image?: string,
    publisher_id: string,
    last_updated?: string,
    visibility?: PostVisibility,
    is_authorized?: PostAuthorization,
    tags?: Set<string>
}

export class Post extends Entity {
    static manager = EntityTableManager.entityManager(this);

    @attribute.partitionKey.string({ prefix: "P" })
    override pk: string;

    @attribute.string()
    title: string;

    @attribute.string()
    content: string;

    @attribute.gsi.partitionKey.string({ indexName: "gsi1", prefix: "PPI" })
    override gsi1pk: string;
    publisher_id?: string;

    @attribute.string()
    cover_image?: string;

    @attribute.lsi.sortKey.string({ indexName: 'lsi1sk', prefix: "PLU" })
    override lsi1sk: string;
    last_updated?: string;

    @attribute.lsi.sortKey.string({ indexName: 'lsi2sk', prefix: "PA" })
    override lsi2sk: PostAuthorization;
    is_authorized?: PostAuthorization;

    @attribute.lsi.sortKey.string({ indexName: 'lsi3sk', prefix: "PV" })
    override lsi3sk: PostVisibility;
    visibility?: PostVisibility;

    @attribute.set()
    tags: Set<string>

    swapKeys() {
        this.publisher_id = this.gsi1pk;
        this.last_updated = this.lsi1sk;
        this.is_authorized = this.lsi2sk;
        this.visibility = this.lsi3sk;
        return this;
    }

    nullifyKeys() {
        // @ts-expect-error no error, parent class has this too
        this.gsi1pk = undefined;
        // @ts-expect-error no error, parent class has this too
        this.lsi1sk = undefined;
        // @ts-expect-error no error, parent class has this too
        this.lsi2sk = undefined;
        // @ts-expect-error no error, parent class has this too
        this.lsi3sk = undefined;
        return this;
    }

    constructor(props: EntityProps & PostProps) {
        super(props);
        this.pk = props.pk ?? props.id ?? uuid();

        this.title = props.title;
        this.content = props.content;
        this.cover_image = props.cover_image;
        this.gsi1pk = props.gsi1pk ?? props.publisher_id;
        this.tags = props.tags ?? new Set(['']);

        this.lsi1sk = props.lsi1sk ?? new Date().toISOString();
        this.lsi2sk = props.lsi2sk as PostAuthorization ?? props.is_authorized ?? PostAuthorization.False;
        this.lsi3sk = props.lsi3sk as PostVisibility ?? props.visibility ?? PostVisibility.Private;
    }
}

export enum TagType {
    Keyword = 'k',
    Slug = 's'
}

export class Tag extends Entity {
    static manager = EntityTableManager.entityManager(this);

    @attribute.partitionKey.string({ prefix: "T" })
    override pk: string;

    @attribute.sortKey.string({ prefix: "E" })
    override sk: string;

    constructor(props: EntityProps & { type: TagType, tag: string, entityId: string }) {
        super(props);

        this.pk = props.pk ?? Tag.buildPk(props.type, props.tag);
        this.sk = props.sk ?? props.entityId;

        this.created_at = undefined;
        this.updated_at = undefined;
    }

    static async doesExists(type: TagType, tag: string, entityId: string): Promise<boolean> {
        return this.manager.get(new EntityKey(new EntityKey(type, tag).toString(), entityId), { attributes: ['pk'] }).then(() => true).catch(() => false)
    }

    static buildPk(type: TagType, tag: string) {
        return new EntityKey(type, slugify(tag)).toString()
    }
}

type Resource = "post" | "assignment";
type AdminRole = "publish" | "delete" | "modify";

type AdminPermission = `${Resource}:${AdminRole}`;

export class Admin extends Entity {
    @attribute.partitionKey.string({ prefix: 'A' })
    override pk: string;

    @attribute.set()
    permissions: Set<AdminPermission>;

    @attribute.string()
    name: string;

    @attribute.string()
    contact: string;

    @attribute.boolean()
    blacklisted: boolean;

    constructor(props: EntityProps & AdminProps) {
        super(props);

        this.pk = props.pk ?? uuid();
        this.contact = props.contact;
        this.name = props.name;
        this.permissions = props.permissions ?? new Set(['']);
        this.blacklisted = props.blacklisted ?? true;
    }
}

type AdminProps = {
    name: string;
    contact: string;
    permissions: Set<AdminPermission>;
    blacklisted: boolean;
}

export class Seo extends Entity {
    static manager = EntityTableManager.entityManager(this);

    @attribute.partitionKey.string({ prefix: "S" })
    override pk: string;

    @attribute.string()
    title: string;

    @attribute.string()
    description: string;

    @attribute.set()
    keywords: Set<string>;

    @attribute.string()
    opengraph?: string;

    constructor(props: EntityProps & { entityId: string; title: string; description: string; keywords?: Set<string>; opengraph?: string }) {
        super(props);

        this.pk = props.pk ?? props.entityId;
        this.title = props.title;
        this.description = props.description;
        this.keywords = props.keywords ? new Set(props.keywords) : new Set(['']);
        this.opengraph = props.opengraph;

        this.created_at = undefined;
    }
}