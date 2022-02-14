// @flow
import type { ConfigurationOverlay, PerLocationMap } from './config';

export type CrrCounter = {|
  +count: number,
  +size?: number,
|};

export type VersionCounter = {|
  curr: number,
  prev: number,
|};

export type CrrStatUnitProps = {|
  backlog: CrrCounter,
  completions: CrrCounter,
  throughput: CrrCounter,
  failures: CrrCounter,
  stalled: CrrCounter,
  pending: CrrCounter,
|};

export type CrrStatUnit = {|
  ...CrrStatUnitProps,
  byLocation: $ReadOnly<PerLocationMap<CrrStatUnitProps>>,
|};

export type EnabledState = 'enabled' | 'disabled';

export type WorkflowScheduleUnitState = $ReadOnly<PerLocationMap<EnabledState>>;

export type WorkflowScheduleUnit = {|
  +states: WorkflowScheduleUnitState,
  +schedules: $ReadOnly<PerLocationMap<string>>,
|};

export type CrrScheduleUnit = WorkflowScheduleUnit;

export type IngestScheduleUnit = WorkflowScheduleUnit;

export type DataManagedUnit = {|
  total: VersionCounter,
  byLocation: $ReadOnly<PerLocationMap<VersionCounter>>,
|};

export type Bucket = {|
  +name: string,
  +location: string,
  +ownerCanonicalId: string,
  +isVersioned?: boolean,
|};

export type BucketList = Array<Bucket>;

export type ItemCountsUnit = {|
  dataManaged?: DataManagedUnit,
  versions?: number,
  objects?: number,
  buckets?: number,
  bucketList?: BucketList,
|};

export type DiskUsageUnit = {|
  total: number,
  available: number,
  free: number,
|};

export type MemoryUnit = {|
  total: number,
  free: number,
|};

export type CpuUnit = {|
  idle: number,
  nice: number,
  sys: number,
  user: number,
|};

export type InstanceStatus = {|
  +metrics?: MetricsUnit,
  +state: InstanceStateSnapshot,
|};

export type MetricsUnit = {|
  cpu?: CpuUnit,
  'crr-stats'?: CrrStatUnit,
  'item-counts'?: ItemCountsUnit,
  'data-disk-usage'?: DiskUsageUnit,
  memory?: MemoryUnit,
  'crr-schedule'?: CrrScheduleUnit,
  'ingest-schedule'?: IngestScheduleUnit,
|};

export type InstanceStateSnapshot = {|
  +capabilities: {
    +secureChannel: boolean,
  },
  +latestConfigurationOverlay: ConfigurationOverlay,
  +runningConfigurationVersion: number,
  +lastSeen: string,
  +serverVersion: string,
|};
