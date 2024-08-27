/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';

import {Button} from '@/components/buttons';
import {CreateNewTabModal, DeleteTabModal} from '@/components/modals';
import {useAuthContext} from '@/contexts/authContext';
import {useSettingsContext} from '@/contexts/settingsContext';
import {useChatStore} from '@/store';
import {IWorkspace} from '@/types';

import SectorsData from './sectorsDetails';

const Sectors = () => {
  const [addSectorsModal, setAddSectorsModal] = useState(false);
  const [deleteSectorsModal, setDeleteSectorsModal] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<IWorkspace | null>(null);
  const {settingIsLoading} = useSettingsContext();
  const {workspaces, getWorkspaces} = useChatStore();
  const {user} = useAuthContext();

  const handleCloseWorkspaceDialog = () => {
    setSelectedWorkspace(null);
    setAddSectorsModal(false);
  };
  const handleOpenEditWorkspaceDialog = (workspace: IWorkspace) => {
    setSelectedWorkspace(workspace);
    setAddSectorsModal(true);
  };

  const handleOpenDeleteWorkspaceDialog = (workspace: IWorkspace) => {
    setSelectedWorkspace(workspace);
    setDeleteSectorsModal(true);
  };
  const handleCloseDeleteWorkspaceDialog = () => {
    setSelectedWorkspace(null);
    setDeleteSectorsModal(false);
  };

  useEffect(() => {
    getWorkspaces();
  }, []);
  return (
    <>
      <div className='w-full pt-9 flex flex-col px-6'>
        <div className='flex flex-col w-full max-w-[608px] px-6 py-4 rounded-xl bg-grey-0'>
          <div className='flex justify-between items-center gap-8 flex-wrap mb-5'>
            <h1 className='text-lg leading-7 text-grey-900 font-semibold'>Sectors</h1>
            <Button
              className='!px-6 font-semibold text-sm !h-34-px'
              variant='primary'
              title='Add sector'
              onClick={() => setAddSectorsModal(true)}
            />
          </div>
          <div className='max-w-full'>
            <SectorsData
              isLoading={settingIsLoading}
              workspaces={workspaces}
              onEditWorkspace={handleOpenEditWorkspaceDialog}
              onDeleteWorkspace={handleOpenDeleteWorkspaceDialog}
            />
          </div>
        </div>
      </div>
      {/* <AddSectorModal open={addSectorsModal} onClose={() => setAddSectorsModal(false)} /> */}
      {user && (
        <CreateNewTabModal
          roles={user.roles}
          tab={selectedWorkspace}
          open={addSectorsModal}
          onClose={handleCloseWorkspaceDialog}
        />
      )}
      <DeleteTabModal tab={selectedWorkspace} open={deleteSectorsModal} onClose={handleCloseDeleteWorkspaceDialog} />
    </>
  );
};

export default Sectors;
