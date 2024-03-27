'use client';
import Category from '@/lib/category';
import styles from './styles.module.css';
import { useState, useEffect, ChangeEvent } from 'react';
import CategoryDict from '@/lib/categoryArray';
import { Checkbox, FormControlLabel } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRange } from 'react-date-range';
import CommonButton from '@/components/common-button/Common-Button';
import { useTheme } from '@mui/material';
import NextImage from 'next/image';
import DeleteIcon from '@mui/icons-material/Delete';
import { useOnboardingContext } from '@/lib/context';
import { useRouter } from 'next/navigation';
interface DateSelection {
  startDate: Date | undefined;
  endDate: Date | undefined;
  key: string;
}
const ErrorLabel = ({
  fieldname,
  errors,
}: {
  fieldname: string;
  errors: Record<string, string[]>;
}) => {
  if (fieldname in errors) {
    return <p className={styles.errorLabel}>{errors[fieldname][0]}</p>;
  }
  return null;
};

interface MyComponentProps {
  setDate: (dateSelection: DateSelection[]) => void;
}
const MyComponent: React.FC<MyComponentProps> = ({ setDate }) => {
  const [state, setState] = useState<DateSelection[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);
  return (
    <DateRange
      editableDateInputs={true}
      onChange={(item) => {
        setState([item.selection] as DateSelection[]);
        setDate([item.selection] as DateSelection[]);
      }}
      moveRangeOnFirstSelection={false}
      ranges={state}
      minDate={new Date()}
    />
  );
};

const updateCategories = () => {
  let updateCategories: { [key in string]: boolean } = {};

  Object.values(Category).map((category: string) => (updateCategories[category] = false));

  return updateCategories;
};

export default function CreateEvent() {
  const router = useRouter();
  const { session, status } = useOnboardingContext();
  const theme = useTheme();
  const [errors, setErrors] = useState({});
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<DateSelection[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);
  const [postingEvent, setPostingEvent] = useState(false);
  const [eventImg, setEventImg] = useState<File | null>(null);
  const [categoryCheckboxState, setCategoryCheckboxState] = useState<{ [key in string]: boolean }>(
    {},
  );

  useEffect(() => {
    setCategoryCheckboxState(updateCategories());
  }, []);
  const handleCategoryChange = (event: { target: { name: any; checked: any } }) => {
    setCategoryCheckboxState({
      ...categoryCheckboxState,
      [event.target.name]: event.target.checked,
    });
  };
  const uploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const errorsNow: { [key: string]: string[] } = {};
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const file = e.target.files?.[0];
    const maxSizeMB = 2;
    const maxWidth = 800;
    const maxHeight = 400;

    if (!file || !file.type.startsWith('image/')) {
      errorsNow.eventImg = ['Please select an image.'];
    } else {
      if (!allowedTypes.includes(file.type)) {
        errorsNow.eventImg = ['Only JPEG, PNG, or GIF images are allowed.'];
      }

      if (file.size / 1024 / 1024 > maxSizeMB) {
        errorsNow.eventImg = [`The image must be smaller than ${maxSizeMB}MB.`];
      }

      try {
        await new Promise<void>((resolve, reject) => {
          const imageElement = new Image();
          imageElement.onload = function () {
            if (imageElement.width > maxWidth || imageElement.height > maxHeight) {
              errorsNow.eventImg = [
                `The image must be smaller than ${maxWidth}x${maxHeight} pixels.`,
              ];
              reject();
            } else {
              resolve();
            }
          };
          imageElement.onerror = function () {
            errorsNow.eventImg = ['Error loading the image.'];
            reject();
          };
          imageElement.src = URL.createObjectURL(file);
        });
      } catch (error) {}
    }

    if (Object.values(errorsNow).length === 0) {
      setEventImg(file || null);
    } else {
      removeSelectedImage();
    }
    setErrors(errorsNow);
  };
  const removeSelectedImage = () => {
    let fileInput = document.getElementById('eventPhoto');

    if (fileInput instanceof HTMLInputElement) {
      fileInput.value = '';
      fileInput.dispatchEvent(new Event('change'));
    }

    setEventImg(null);
  };
  const submitEvent = async () => {
    const errorsNow: { [key: string]: string[] } = {};

    if (title === '') {
      errorsNow.title = [...(errorsNow.title || []), "Title can't be empty"];
    }
    if (description === '') {
      errorsNow.description = [...(errorsNow.description || []), "Description can't be empty"];
    }
    if (eventImg === null) {
      errorsNow.eventImg = [...(errorsNow.eventImg || []), 'Please upload event image'];
    }
    if (!Object.values(categoryCheckboxState).includes(true)) {
      errorsNow.categories = [...(errorsNow.categories || []), 'Event needs at least 1 category'];
    }
    if (date.length > 0 && (!date[0].startDate || !date[0].endDate)) {
      errorsNow.date = [...(errorsNow.date || []), 'Please select start and end dates'];
    }
    if (Object.values(errorsNow).length === 0) {
      try {
        const categoriesArray: string[] = Object.entries(categoryCheckboxState)
          .filter(([key, value]) => value === true)
          .map(([key, _]) => key);

        const data = new FormData();
        data.set('image', eventImg as File);
        data.set('title', title as string);
        data.set('description', description as string);
        data.set('eventCreatorId', session.user.id as string);
        categoriesArray.forEach((category) => {
          data.append('categories', category);
        });
        if (date.length > 0) {
          const firstDate = date[0];
          if (firstDate.startDate && firstDate.endDate) {
            data.set('startDate', firstDate.startDate.toString());
            data.set('endDate', firstDate.endDate.toString());
          } else {
            errorsNow.date = [...(errorsNow.date || []), 'Please select start and end dates'];
          }
        }

        const res = await fetch('/api/event', {
          method: 'POST',
          body: data,
        });
        setPostingEvent(true);
        const resData = await res.json();

        if (res.ok) {
          router.push(`/event/${resData.id}`);
          return true;
        } else {
          setPostingEvent(false);

          return (errorsNow.form = [...(errorsNow.form || []), resData.error]);
        }
      } catch (error) {
        setPostingEvent(false);

        return (errorsNow.form = [...(errorsNow.form || []), 'Something go wrong, try again']);
      }
    }
    setErrors(errorsNow);
  };
  return (
    <main className={styles.main}>
      <h2>Create Event</h2>
      <section className={styles.mainSection}>
        <div className={styles.twoDivContainer}>
          <div className={styles.photoLeftBox}>
            <div className={styles.titleBox}>
              <label className={styles.label} htmlFor='title'>
                Title
                <ErrorLabel fieldname='title' errors={errors} />
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='Event Title'
                id='title'
                type='text'
              ></input>
            </div>
            <div>
              <label className={styles.label} htmlFor='description'>
                Description <ErrorLabel fieldname='description' errors={errors} />
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Event Description'
                id='description'
              ></textarea>
            </div>
          </div>
          <div>
            <label className={styles.label}>
              <ErrorLabel fieldname='eventImg' errors={errors} />
            </label>
            <div className={`${styles.eventPhotoBox} ${eventImg ? '' : 'cursor-pointer'}`}>
              {eventImg ? (
                <div className='relative h-full w-full'>
                  <NextImage
                    className=' h-full object-cover'
                    src={URL.createObjectURL(eventImg)}
                    alt='Event Image'
                    width={500} // Agrega el ancho de la imagen
                    height={300} // Agrega la altura de la imagen
                  />
                  <div className='relative w-full'>
                    <div
                      onClick={removeSelectedImage}
                      className='cursor-pointer p-[.5rem] rounded-[50%] absolute flex justify-center items-center right-[15px] bottom-[15px] w-[3rem] h-[3rem] bg-red-500'
                    >
                      <DeleteIcon sx={{ color: 'white' }} />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <label className={styles.labelEventImage} htmlFor='eventPhoto'></label>
                  <FileUploadIcon sx={{ fontSize: '4em', color: '#70b0db' }} />
                  <p>Click here to upload event photo</p>
                  <p>PNG, JPG or GIF(MAX. 800x400px)</p>
                </>
              )}
            </div>
            <input
              accept='image/png, image/gif, image/jpeg'
              className={styles.inputEventPhoto}
              type='file'
              name='eventPhoto'
              id='eventPhoto'
              onChange={uploadImage}
            />
          </div>
        </div>
        <div className={styles.twoDivContainer}>
          <div className={styles.categoryBox}>
            <label className={styles.label}>
              Category <ErrorLabel fieldname='categories' errors={errors} />
            </label>
            <div className={styles.categoriesCheckBox}>
              {Object.entries(categoryCheckboxState).map(([category, checked]) => (
                <FormControlLabel
                  sx={{ color: 'black', textWrap: 'nowrap' }}
                  key={category}
                  control={
                    <Checkbox checked={checked} onChange={handleCategoryChange} name={category} />
                  }
                  label={CategoryDict[category as Category]}
                />
              ))}
            </div>
          </div>
          <div className={styles.dateBox}>
            <label className={styles.label}>
              Date
              <ErrorLabel fieldname='date' errors={errors} />
            </label>
            <MyComponent setDate={setDate} />
          </div>
        </div>
        <label className={styles.label}>
          <ErrorLabel fieldname='form' errors={errors} />
        </label>
        <CommonButton
          disabled={postingEvent}
          onButtonClick={submitEvent}
          label='Create Event'
          textColor={theme.palette.primary.thirdColorIceLight}
          backgroundColor={theme.palette.primary.primaryColorDarkBlue}
          borderColor={theme.palette.primary.thirdColorIceLight}
          additionalStyles={{
            margin: 'auto',
            padding: '15px 30px',
            minWidth: '302px',
            fontSize: '1rem',
            [theme.breakpoints.down(880)]: { minWidth: 0, padding: '5px 20px' },
            [theme.breakpoints.down(720)]: {
              '&.MuiButtonBase-root': {
                fontWeight: '400',
              },
            },
          }}
        />
      </section>
    </main>
  );
}
