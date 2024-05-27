import {Button} from '@/components/buttons';
import React, {useEffect, useState} from 'react';
import {AddSectorModal} from '@/components/modals/AddSectorsModal';
import SectorsData from './sectorsDetails';
import {useSettingsContext} from '@/contexts/settingsContext';
import {CreateNewTabModal, DeleteTabModal} from '@/components/modals';
import {IWorkspace} from '@/types';
import {useChatStore} from '@/store';
import {useAuthContext} from '@/contexts/authContext';

type Props = {};

const Sectors = (props: Props) => {
  const [addSectorsModal, setAddSectorsModal] = useState(false);
  const [deleteSectorsModal, setDeleteSectorsModal] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<IWorkspace | null>(null);
  const {settingIsLoading} = useSettingsContext();
  const {workspaces, getWorkspaces, deleteWorkspace} = useChatStore();
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
      <div className='w-full pt-[84px] flex flex-col px-6'>
        <div className='flex flex-col w-full max-w-[608px] px-6 py-4 rounded-20 bg-white'>
          <div className='flex justify-between items-center gap-8 flex-wrap mb-5'>
            <h1 className='text-lg leading-7 text-content-black font-poppins-semibold'>Sectors</h1>
            <Button
              className='!px-6 font-poppins-semibold text-sm !h-34-px'
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
