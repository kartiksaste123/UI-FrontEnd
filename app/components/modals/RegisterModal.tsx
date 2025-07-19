'use client';

import axios from "axios";
import { AiFillGithub } from "react-icons/ai";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { 
  FieldValues, 
  SubmitHandler,
  useForm
} from "react-hook-form";

import useLoginModal from "@/app/hooks/useLoginModal";
import useRegisterModal from "@/app/hooks/useRegisterModal";

import Modal from "./Modal";
import Input from "../inputs/Input";
import Heading from "../Heading";
import Button from "../Button";

const RegisterModal= () => {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);

  const { 
    register, 
    handleSubmit,
    formState: {
      errors,
    },
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phoneNumber: '',
      firstName: '',
      lastName: '',
      gender: '',
      dateOfBirth: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      country: '',
      postalCode: ''
    },
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    // Validate all fields are present
    const requiredFields = [
      'name', 'email', 'password', 'phoneNumber', 'firstName', 'lastName', 'gender', 'dateOfBirth',
      'addressLine1', 'addressLine2', 'city', 'state', 'country', 'postalCode'
    ];
    for (const field of requiredFields) {
      if (!data[field]) {
        toast.error(`Missing required field: ${field}`);
        setIsLoading(false);
        return;
      }
    }

    const payload = {
      username: data.name,
      emailId: data.email,
      password: data.password,
      phoneNumber: data.phoneNumber,
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      dateOfBirth: data.dateOfBirth,
      address: {
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        state: data.state,
        country: data.country,
        postalCode: data.postalCode
      }
    };

    axios.post('http://localhost:8081/auth/register', payload)
    .then(() => {
      toast.success('Registered! Please login.');
      registerModal.onClose();
      loginModal.onOpen();
    })
    .catch((error) => {
      if (error.response && error.response.status === 409) {
        toast.error('Email already registered.');
      } else if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Registration failed.');
      }
    })
    .finally(() => {
      setIsLoading(false);
    })
  }

  const onToggle = useCallback(() => {
    registerModal.onClose();
    loginModal.onOpen();
  }, [registerModal, loginModal])

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title="Welcome to Rentpal"
        subtitle="Create an account!"
      />
      <Input id="email" label="Email" disabled={isLoading} register={register} errors={errors} required />
      <Input id="name" label="Username" disabled={isLoading} register={register} errors={errors} required />
      <Input id="password" label="Password" type="password" disabled={isLoading} register={register} errors={errors} required />
      <Input id="phoneNumber" label="Phone Number" disabled={isLoading} register={register} errors={errors} required />
      <Input id="firstName" label="First Name" disabled={isLoading} register={register} errors={errors} required />
      <Input id="lastName" label="Last Name" disabled={isLoading} register={register} errors={errors} required />
      <Input id="gender" label="Gender" disabled={isLoading} register={register} errors={errors} required />
      <Input id="dateOfBirth" label="Date of Birth" type="date" disabled={isLoading} register={register} errors={errors} required />
      <Input id="addressLine1" label="Address Line 1" disabled={isLoading} register={register} errors={errors} required />
      <Input id="addressLine2" label="Address Line 2" disabled={isLoading} register={register} errors={errors} required />
      <Input id="city" label="City" disabled={isLoading} register={register} errors={errors} required />
      <Input id="state" label="State" disabled={isLoading} register={register} errors={errors} required />
      <Input id="country" label="Country" disabled={isLoading} register={register} errors={errors} required />
      <Input id="postalCode" label="Postal Code" disabled={isLoading} register={register} errors={errors} required />
    </div>
  )

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <Button 
        outline 
        label="Continue with Google"
        icon={FcGoogle}
        onClick={() => signIn('google')} 
      />
      <Button 
        outline 
        label="Continue with Github"
        icon={AiFillGithub}
        onClick={() => signIn('github')}
      />
      <div 
        className="
          text-neutral-500 
          text-center 
          mt-4 
          font-light
        "
      >
        <p>Already have an account?
          <span 
            onClick={onToggle} 
            className="
              text-neutral-800
              cursor-pointer 
              hover:underline
            "
            > Log in</span>
        </p>
      </div>
    </div>
  )

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="Register"
      actionLabel="Continue"
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
}

export default RegisterModal;
