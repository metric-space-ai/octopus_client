import {Button} from '@/components/buttons';
import React, {useState} from 'react';
import {UploadWaspAppModal} from '@/components/modals/WaspAppModals';
import WaspAppsDetails from './WaspAppsDetails';
import {IWaspApp} from '@/types';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '@/app/lib/store';
import {useSelector} from 'react-redux';
import {selectWaspApps} from '@/app/lib/features/waspApps/waspAppsSelector';
import {
  deleteWaspAppById,
  handleChangeOpenRemoveWaspAppDialog,
  handleChangeSelectedWaspApp,
} from '@/app/lib/features/waspApps/waspAppsSlice';
import RemoveWaspAppModal from '@/components/modals/WaspAppModals/RemoveWaspAppModal';

type Props = {};

const WaspApps = (props: Props) => {
  const dispatch = useDispatch<AppDispatch>();

  const {selectedWaspApp, openRemoveWaspAppDialog} = useSelector(selectWaspApps);
  const [openwaspAppModal, setOpenwaspAppModal] = useState(false);

  const handleOpenExistedWaspAppModal = (waspApp: IWaspApp) => {
    dispatch(handleChangeSelectedWaspApp(waspApp));
    setOpenwaspAppModal(true);
  };
  const handleOpenUploadNewWaspApp = () => {
    setOpenwaspAppModal(true);
    dispatch(handleChangeSelectedWaspApp(null));
  };

  const handleCloseWaspAppModal = async () => {
    dispatch(handleChangeSelectedWaspApp(null));

    setOpenwaspAppModal(false);
  };
  const handleConfirmDeleteWaspApp = async () => {
    if (!selectedWaspApp) return;
    dispatch(deleteWaspAppById(selectedWaspApp.id));
  };
  return (
    <>
      <div className='flex flex-col w-full px-4 py-4'>
        <div className='flex justify-between items-center gap-8 flex-wrap mb-5'>
          <h1 className='text-lg leading-7 text-grey-900 font-semibold'>Wasp Apps</h1>
          <Button
            className='!px-6 font-semibold text-sm !h-34-px'
            variant='primary'
            title='Upload Wasp'
            onClick={handleOpenUploadNewWaspApp}
          />
        </div>
        <div className='w-full relative'>
          <WaspAppsDetails handleOpenExistedWaspAppModal={handleOpenExistedWaspAppModal} />
        </div>
      </div>
      {selectedWaspApp && (
        <RemoveWaspAppModal
          onDelete={handleConfirmDeleteWaspApp}
          open={openRemoveWaspAppDialog}
          waspApp={selectedWaspApp}
          onClose={() => {
            dispatch(handleChangeOpenRemoveWaspAppDialog(false));
            dispatch(handleChangeSelectedWaspApp(null));
          }}
        />
      )}
      <UploadWaspAppModal open={openwaspAppModal} onClose={handleCloseWaspAppModal} selectedWasp={selectedWaspApp} />
    </>
  );
};

export default WaspApps;
