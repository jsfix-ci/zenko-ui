// @flow

export const NFS_OPT_CONFLICT = {
    soft: 'hard', hard: 'soft',
    intr: 'nointr', nointr: 'intr',
    ac: 'noac', noac: 'ac',
    bg: 'fg', fg: 'bg',
    rdirplus: 'nordirplus', nordirplus: 'rdirplus',
    sharecache: 'nosharecache', nosharecache: 'sharecache',
    resvport: 'noresvport', noresvport: 'resvport',
    fsc: 'nofsc', nofsc: 'fsc',
    async: 'sync', sync: 'async',
    rw: 'ro', ro: 'rw',
};

const NFS_OPTIONS = {
    sync: true, async: true,
    rw: true, ro: true,
    nfsvers: true,
    vers: true,
    soft: true, hard: true,
    intr: true, nointr: true,
    timeo: true,
    retrans: true,
    rsize: true, wsize: true,
    ac: true, noac: true,
    acregmin: true, acregmax: true,
    acdirmin: true, acdirmax: true,
    actimeo: true,
    bg: true, fg: true,
    rdirplus: true, nordirplus: true,
    retry: true,
    sec: true,
    sharecache: true, nosharecache: true,
    resvport: true, noresvport: true,
    lookupcache: true,
    fsc: true, nofsc: true,
};

export const NFS_V3_OPTIONS = Object.assign({}, NFS_OPTIONS, {
    proto: true,
    udp: true, tcp: true,
    rdma: true,
    port: true,
    mountport: true,
    mountproto: true,
    mounthost: true,
    mountvers: true,
    namelen: true,
    lock: true, nolock: true,
    cto: true, nocto: true,
    acl: true, noacl: true,
    local_lock: true,
});

export const NFS_V3_CONFLICTS = {
    lock: 'nolock', nolock: 'lock',
    cto: 'nocto', nocto: 'cto',
    acl: 'noacl', noacl: 'acl',
};

export const NFS_V4_OPTIONS = Object.assign({}, NFS_OPTIONS, {
    proto: true,
    prot: true,
    cto: true, nocto: true,
    clientaddr: true,
    migration: true, nomigration: true,
});

export const NFS_V4_CONFLICTS = {
    migration: 'nomigration', nomigration: 'migration',
};
