import { useCallback, useMemo, useReducer, useRef, useState } from 'react';
import { useCombobox } from 'downshift';
import {
  AWS_PAGINATED_QUERY,
  useAwsPaginatedEntities,
} from '../../utils/IAMhooks';
import { Box, Table } from '@scality/core-ui/dist/next';
import { InlineButton } from '../../ui-elements/Table';
import { Loader, SearchInput, Tooltip } from '@scality/core-ui';
import styled from 'styled-components';
import { spacing } from '@scality/core-ui/dist/style/theme';
import { tableRowHeight } from '@scality/core-ui/dist/components/tablev2/TableUtils';

export type AttachableEntity = {
  name: string;
  arn: string;
};

type AttachableEntityWithPendingStatus = {
  isPending?: boolean;
} & AttachableEntity

export enum AttachmentType {
  ADD,
  REMOVE,
}

export type AttachmentOperation = {
  type: AttachmentType;
  entity: AttachableEntity;
};

export type AttachmentTableProps<
  API_RESPONSE extends {
    Marker?: string;
  },
> = {
  initiallyAttachedEntities: AttachableEntity[];
  getAllEntitiesPaginatedQuery: () => AWS_PAGINATED_QUERY<
    API_RESPONSE,
    AttachableEntity
  >;
  getEntitiesFromResult: (response: API_RESPONSE) => AttachableEntity[];
  onAttachmentsOperationsChanged: (
    attachmentOperations: AttachmentOperation[],
  ) => void;
};

const rowHeight = 'h48';

const MenuContainer = styled.ul<{
  width: string;
  isOpen: boolean;
  searchInputIsFocused: boolean;
}>`
  max-height: ${parseFloat(tableRowHeight[rowHeight]) * 5}rem;
  overflow-y: scroll;
  background-color: ${(props) => props.theme.brand.backgroundLevel1};
  padding: 0;
  list-style: none;
  position: absolute;
  width: ${(props) => props.width};
  z-index: 1;
  margin-top: -1.7rem;
  margin-left: 0;
  margin-bottom: 0;
  margin-right: 0;
  ${(props) =>
    props.isOpen
      ? `
  border-left: 1px solid ${props.theme.brand.secondary};
  border-right: 1px solid ${props.theme.brand.secondary};
  border-bottom: 1px solid ${props.theme.brand.secondary};
  `
      : props.searchInputIsFocused
      ? `border-bottom: 1px solid ${props.theme.brand.secondary};`
      : ''}
  border-top: 0;
  li {
    padding: ${spacing.sp8};
    border: 1px solid ${(props) => props.theme.brand.backgroundLevel2};
    &[aria-selected='true'] {
      background: ${(props) => props.theme.brand.highlight};
    }
  }
`;

const SearchBoxContainer = styled.div`
  margin-bottom: ${spacing.sp24};
  .sc-tooltip {
    width: 100%;
  }
`;

const StyledSearchInput = styled(SearchInput)`
  flex-grow: 1;
  .sc-input-type:focus {
    border-bottom: 0;
  }
`;

const AttachmentTableContainer = styled.div`
  height: 100%;
  background: ${(props) => props.theme.brand.backgroundLevel3};
  padding: ${spacing.sp24};
`;

export const AttachmentTable = <
  API_RESPONSE extends {
    Marker?: string;
  },
>({
  initiallyAttachedEntities,
  getAllEntitiesPaginatedQuery,
  getEntitiesFromResult,
  onAttachmentsOperationsChanged,
}: AttachmentTableProps<API_RESPONSE>) => {
  //Desired attached entities and onAttachmentsOperationsChanged handling

  const [{ desiredAttachedEntities }, dispatch] = useReducer(
    (
      state: {
        desiredAttachedEntities: AttachableEntityWithPendingStatus[];
        attachmentsOperations: AttachmentOperation[];
      },
      action:
        | { type: AttachmentType.ADD; entity: AttachableEntity }
        | { type: AttachmentType.REMOVE; entity: AttachableEntity },
    ) => {
      switch (action.type) {
        case AttachmentType.ADD:
          if (
            !state.desiredAttachedEntities.find(
              (entity) => entity.arn === action.entity.arn,
            )
          ) {
            const newState = {
              ...state,
              desiredAttachedEntities: [
                { ...action.entity, isPending: true },
                ...state.desiredAttachedEntities,
              ],
              attachmentsOperations: [...state.attachmentsOperations, action],
            };
            onAttachmentsOperationsChanged(newState.attachmentsOperations);
            return newState;
          }
          break;
        case AttachmentType.REMOVE:
          if (
            state.desiredAttachedEntities.find(
              (entity) => entity.arn === action.entity.arn,
            )
          ) {
            const newDesiredAttachedEntities = [
              ...state.desiredAttachedEntities,
            ];
            newDesiredAttachedEntities.splice(
              state.desiredAttachedEntities.findIndex(
                (entity) => entity.arn === action.entity.arn,
              ),
              1,
            );
            const newAttachmentsOperations = [...state.attachmentsOperations];
            const existingOperationIndexOnThisEntity =
              state.attachmentsOperations.findIndex(
                (operation) => operation.entity.arn === action.entity.arn,
              );
            if (
              existingOperationIndexOnThisEntity !== -1 &&
              state.attachmentsOperations[existingOperationIndexOnThisEntity]
                .type === AttachmentType.ADD
            ) {
              newAttachmentsOperations.splice(
                existingOperationIndexOnThisEntity,
                1,
              );
            } else if (
              existingOperationIndexOnThisEntity !== -1 &&
              state.attachmentsOperations[existingOperationIndexOnThisEntity]
                .type === AttachmentType.REMOVE
            ) {
              return state;
            } else {
              newAttachmentsOperations.push(action);
            }
            const newState = {
              ...state,
              desiredAttachedEntities: newDesiredAttachedEntities,
              attachmentsOperations: newAttachmentsOperations,
            };
            onAttachmentsOperationsChanged(newState.attachmentsOperations);
            return newState;
          }
          break;
      }
      return state;
    },
    {
      desiredAttachedEntities: initiallyAttachedEntities,
      attachmentsOperations: [],
    },
  );

  const resetRef = useRef<() => void | null>(null);

  const onSelectedItemChange = useCallback(
    ({ selectedItem }) => {
      if (selectedItem) {
        dispatch({ type: AttachmentType.ADD, entity: selectedItem });
        if (resetRef.current) resetRef.current();
      }
    },
    [resetRef],
  );

  //Search box and entities fetching logic

  const [{ filteredEntities }, dispatchEntitiesEvent] = useReducer(
    (
      state: {
        allEntities: AttachableEntity[];
        filteredEntities: AttachableEntity[];
        query: string;
        numberOfFilteredEntities: number;
      },
      action:
        | { type: 'RECEIVED_ENTITIES'; entities: AttachableEntity[] }
        | { type: 'FILTER_ENTITIES'; query?: string },
    ) => {
      switch (action.type) {
        case 'RECEIVED_ENTITIES': {
          const allFilteredEntities = action.entities.filter((item) =>
            item.name.toLowerCase().startsWith(state.query.toLowerCase()),
          );
          return {
            ...state,
            filteredEntities: allFilteredEntities.slice(0, 10),
            numberOfFilteredEntities: allFilteredEntities.length,
            allEntities: action.entities,
          };
        }
        case 'FILTER_ENTITIES': {
          const allFilteredEntities = state.allEntities.filter((item) =>
            item.name
              .toLowerCase()
              .startsWith(action.query?.toLowerCase() || ''),
          );
          return {
            ...state,
            query: action.query || '',
            filteredEntities: allFilteredEntities.slice(0, 10),
            numberOfFilteredEntities: allFilteredEntities.length,
          };
        }
      }
      return state;
    },
    {
      allEntities: [],
      filteredEntities: [],
      query: '',
      numberOfFilteredEntities: 0,
    },
  );

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    openMenu,
    getItemProps,
    reset,
  } = useCombobox({
    items: filteredEntities,
    onSelectedItemChange,
    onInputValueChange: ({ inputValue }) => {
      dispatchEntitiesEvent({ type: 'FILTER_ENTITIES', query: inputValue });
    },
  });

  const { firstPageStatus, status } = useAwsPaginatedEntities(
    {
      ...getAllEntitiesPaginatedQuery(),
      onPageSuccess: (entities) => {
        dispatchEntitiesEvent({ type: 'RECEIVED_ENTITIES', entities });
      },
    },
    getEntitiesFromResult,
  );

  useMemo(() => {
    resetRef.current = reset;
  }, [reset]);

  // UI styling states
  const [searchWidth, setSearchWidth] = useState('0px');
  const [searchInputIsFocused, setSearchInputIsFocused] = useState(false);

  return (
    <AttachmentTableContainer>
      <div {...getComboboxProps()}>
        <SearchBoxContainer
          ref={(element) => {
            if (element) {
              setSearchWidth(element.getBoundingClientRect().width - 1 + 'px');
            }
          }}
        >
          {firstPageStatus === 'error' || firstPageStatus === 'loading' ? (
            <Tooltip
              overlay={
                firstPageStatus === 'error' ? (
                  <>We failed to load the entities, hence search is disabled</>
                ) : firstPageStatus === 'loading' ? (
                  <>Search is disabled while loading entities</>
                ) : (
                  <></>
                )
              }
            >
              <Box display="flex" alignItems="center" width="100%" gap={8}>
                <StyledSearchInput
                  {...getInputProps()}
                  onFocus={() => {
                    openMenu();
                    setSearchInputIsFocused(true);
                  }}
                  onBlur={() => {
                    setSearchInputIsFocused(false);
                  }}
                  disableToggle
                  disabled={
                    firstPageStatus === 'error' || firstPageStatus === 'loading'
                  }
                />
                <Loader />
              </Box>
            </Tooltip>
          ) : (
            <StyledSearchInput
              {...getInputProps()}
              onFocus={() => {
                openMenu();
                setSearchInputIsFocused(true);
              }}
              onBlur={() => {
                setSearchInputIsFocused(false);
              }}
              disableToggle
            />
          )}
        </SearchBoxContainer>
      </div>
      <MenuContainer
        {...getMenuProps()}
        width={searchWidth}
        isOpen={isOpen}
        searchInputIsFocused={searchInputIsFocused}
      >
        {isOpen &&
          filteredEntities.slice(0, 10).map((item, index) => (
            <li key={`${item.arn}${index}`} {...getItemProps({ item, index })}>
              {item.name}
            </li>
          ))}
        {isOpen && filteredEntities.length === 0 && status === 'loading' && (
          <li>Searching...</li>
        )}
        {isOpen && filteredEntities.length === 0 && status === 'success' && (
          <li>No entities found matching your search.</li>
        )}
      </MenuContainer>
      <Table
        columns={[
          {
            Header: 'Name',
            accessor: 'name',
            cellStyle: {
              minWidth: '20rem',
            },
          },
          {
            Header: 'Attachment status',
            accessor: 'isPending',
            cellStyle: {
              minWidth: '40rem',
            },
            Cell: ({ value }: { value?: boolean }) => {
              return value ? 'Pending' : 'Attached';
            },
          },
          {
            Header: '',
            accessor: 'action',
            cellStyle: {
              textAlign: 'right',
              minWidth: '10rem',
              marginLeft: 'auto',
            },
            Cell: ({
              row: { original: entity },
            }: {
              row: { original: AttachableEntity };
            }) => (
              <InlineButton
                onClick={() => {
                  dispatch({
                    type: AttachmentType.REMOVE,
                    entity: { name: entity.name, arn: entity.arn },
                  });
                }}
                icon={<i className="fas fa-times"></i>}
                label="Remove"
                variant="danger"
              />
            ),
          },
        ]}
        data={desiredAttachedEntities.map((entity) => ({
          ...entity,
          isPending: entity.isPending || false,
          action: null,
        }))}
        defaultSortingKey="name"
      >
        <Table.SingleSelectableContent
          backgroundVariant="backgroundLevel4"
          rowHeight={rowHeight}
          separationLineVariant="backgroundLevel2"
        />
      </Table>
    </AttachmentTableContainer>
  );
};
