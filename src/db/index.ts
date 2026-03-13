import { DDB_TABLE_NAME, DDB_TABLE_REGION } from "@/constants";
import { envvar, tryCatch } from "@/lib";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { Dynamode, attribute, TableManager, Entity as DEntity } from "dynamode";

const IS_LOCAL_DB = false; // if db is running on docker locally

const db = new DynamoDB({
    region: DDB_TABLE_REGION,
    credentials: {
        accessKeyId: envvar("AWS_ACCESS_KEY_ID"),
        secretAccessKey: envvar("AWS_SECRET_ACCESS_KEY")
    }
});

if (IS_LOCAL_DB && process.env.NODE_ENV !== "production") Dynamode.ddb.local();
else Dynamode.ddb.set(db)

export type EntityProps = {
    pk?: string,
    sk?: string,
    gsi1pk?: string,
    gsi1sk?: string,
    lsi1sk?: string,
    lsi2sk?: string,
    lsi3sk?: string,
    lsi4sk?: string,
    // lsi5sk?: string,
    created_at?: Date,
    updated_at?: Date,
}

export class EntityKey {
    pk: string;
    sk: string;

    static defaultSk = "!";
    private static delimeter = "$@$";

    constructor(pk: string, sk?: string) {
        this.pk = pk;
        this.sk = sk ?? EntityKey.defaultSk;
    }

    static from(str: string) {
        const [pk, sk] = str.split(EntityKey.delimeter);
        return new this(pk, sk);
    }

    toString() {
        return `${this.pk}${EntityKey.delimeter}${this.sk}`
    }
}

export class Entity extends DEntity {
    @attribute.partitionKey.string()
    pk: string

    @attribute.sortKey.string()
    sk: string

    @attribute.gsi.partitionKey.string({ indexName: "gsi1" })
    gsi1pk?: string;

    @attribute.gsi.sortKey.string({ indexName: "gsi1" })
    gsi1sk?: string;

    @attribute.lsi.sortKey.string({ indexName: 'lsi1' })
    lsi1sk?: string;

    @attribute.lsi.sortKey.string({ indexName: 'lsi2' })
    lsi2sk?: string;

    @attribute.lsi.sortKey.string({ indexName: 'lsi3' })
    lsi3sk?: string;

    @attribute.lsi.sortKey.string({ indexName: 'lsi4' })
    lsi4sk?: string;

    @attribute.date.string()
    updated_at?: Date;

    @attribute.date.string()
    created_at?: Date;

    constructor(props: EntityProps) {
        super();
        this.pk = props.pk!;
        this.sk = props.sk ?? EntityKey.defaultSk;
        this.gsi1pk = props.gsi1pk;
        this.gsi1sk = props.gsi1sk ?? props.gsi1pk ? 'g1s' : undefined;
        this.lsi1sk = props.lsi1sk;
        this.lsi2sk = props.lsi2sk;
        this.lsi3sk = props.lsi3sk;
        this.lsi4sk = props.lsi4sk;

        this.created_at = props.created_at ?? new Date();
        this.updated_at = props.updated_at ?? new Date();
    }

    static async exists(pk: string, sk?: string): Promise<boolean> {
        // @ts-expect-error manager should be defined in child class
        return this.manager!.get(new EntityKey(pk, sk), { attributes: ['pk'] }).then(_ => true).catch(_ => false)
    }
}

export const EntityTableManager = new TableManager(Entity, {
    tableName: `${DDB_TABLE_NAME}-${process.env.NODE_ENV === 'production' ? "prod" : "dev"}-ddb`,
    partitionKey: "pk",
    sortKey: "sk",
    indexes: {
        gsi1: {
            partitionKey: 'gsi1pk',
            sortKey: 'gsi1sk'
        },
        lsi1: { sortKey: 'lsi1sk' },
        lsi2: { sortKey: 'lsi2sk' },
        lsi3: { sortKey: 'lsi3sk' },
        lsi4: { sortKey: 'lsi4sk' },
    },
    createdAt: "created_at",
    updatedAt: "updated_at"
})

await tryCatch(EntityTableManager.createTable())