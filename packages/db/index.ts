import { Kysely, DummyDriver, SqliteQueryCompiler, SqliteAdapter, SqliteIntrospector, CompiledQuery, DefaultInsertValueNode } from "kysely";
import { Client, createClient, InArgs } from "@libsql/client";
import type { DB as DBSchema } from 'kysely-codegen/dist/db';




export class DB {
    url: string;
    auth: string | undefined;
    syncUrl: string | undefined
    syncInterval: number | undefined;
    client: Client | undefined;
    qry: Kysely<DBSchema>
    query: any;

    constructor(url: string, auth?: string, syncUrl?: string, syncInterval?: number) {
        this.url = url;
        this.auth = auth
        this.syncUrl = syncUrl
        this.syncInterval = syncInterval

        this.qry = new Kysely<DBSchema>({
            dialect: {
                createAdapter: () => new SqliteAdapter(),
                createDriver: () => new DummyDriver(),
                createIntrospector: (db) => new SqliteIntrospector(db),
                createQueryCompiler: () => new SqliteQueryCompiler(),
            }
        })
    }


    // if with kysely dummy driver for query this will the db 
    callTurso() {
        try {

            return this.client = createClient({
                url: this.url,
                authToken: this.auth,
                syncUrl: this.syncUrl,
                syncInterval: this.syncInterval
            });
        } catch (e) {
            console.error("Error in connecting to turso");
            console.log(e)
        }
    }


    execute(qry: CompiledQuery) {
        try {
            const db: Client | undefined = this.callTurso();
            return db?.execute({ sql: qry.sql, args: qry.parameters as InArgs })

        } catch (e) {
            console.error("Error in querying record")
            console.log(e)
        }
    }
}

/**
 *  const _db = new DB(url(can be local sqlite),authToken,syncing url for turso and sync interval  )
 *  callKysely() is dummy driver for just query building 
 *  callTurso() can be used with turso or local sqlite and 
 *  qry() takes compiled query from callKysely() object and creates turso Client and queries it 
 *  
 */