import {
  CircleCloseFilled,
  Close,
  InfoFilled,
  SuccessFilled,
  WarningFilled,
} from '@element-plus/icons-vue'
import { definePropType } from './props'
import type { Component } from 'vue'
export const warning = `<svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 12 12"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M12 6C12 9.31371 9.31371 12 6 12C2.68629 12 0 9.31371 0 6C0 2.68629 2.68629 0 6 0C9.31371 0 12 2.68629 12 6ZM6.5 2.5V7H5.5V2.5H6.5ZM6.5 9V8H5.5V9H6.5Z"
    />
  </svg>`
export const error = `  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="17"
    height="15"
    viewBox="0 0 17 15"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M0.5 14.6667H16.5L8.5 0.666687L0.5 14.6667ZM9.16667 12H7.83333V10.6667H9.16667V12ZM9.16667 9.33335H7.83333V6.66669H9.16667V9.33335Z"
    />
  </svg>`
export const check = `<svg
    xmlns="http://www.w3.org/2000/svg"
    width="17"
    height="16"
    viewBox="0 0 17 16"
  >
    <g clip-path="url(#clip0_1437_5286)">
      <path
        d="M5.70006 14.2833C5.47716 14.2834 5.25643 14.2395 5.05052 14.1542C4.8446 14.0688 4.65754 13.9437 4.50006 13.786L0.792725 10.0807L2.20739 8.66665L5.70006 12.1593L14.7927 3.06665L16.2074 4.48065L6.90006 13.786C6.74257 13.9437 6.55552 14.0688 6.3496 14.1542C6.14369 14.2395 5.92296 14.2834 5.70006 14.2833Z"
      />
    </g>
    <defs>
      <clipPath id="clip0_1437_5286">
        <rect width="16" height="16" fill="white" transform="translate(0.5)" />
      </clipPath>
    </defs>
  </svg>`
export const info = `  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="17"
    height="16"
    viewBox="0 0 17 16"
  >
    <g clip-path="url(#clip0_1437_5194)">
      <path
        d="M16.5 8C16.5 9.58225 16.0308 11.129 15.1518 12.4446C14.2727 13.7602 13.0233 14.7855 11.5615 15.391C10.0997 15.9965 8.49113 16.155 6.93928 15.8463C5.38743 15.5376 3.96197 14.7757 2.84315 13.6569C1.72433 12.538 0.962403 11.1126 0.653721 9.56072C0.34504 8.00887 0.503466 6.40034 1.10897 4.93853C1.71447 3.47672 2.73985 2.22729 4.05544 1.34824C5.37104 0.469192 6.91775 0 8.5 0C10.621 0.00229405 12.6545 0.845886 14.1543 2.34568C15.6541 3.84547 16.4977 5.87897 16.5 8ZM9.83334 8C9.83334 7.64638 9.69286 7.30724 9.44281 7.05719C9.19276 6.80714 8.85363 6.66667 8.5 6.66667H7.16667V8H8.5V12.6667H9.83334V8ZM8.5 3.33333C8.30222 3.33333 8.10888 3.39198 7.94443 3.50186C7.77998 3.61175 7.65181 3.76792 7.57612 3.95065C7.50044 4.13338 7.48063 4.33444 7.51922 4.52842C7.5578 4.72241 7.65304 4.90059 7.7929 5.04044C7.93275 5.18029 8.11093 5.27553 8.30491 5.31412C8.49889 5.3527 8.69996 5.3329 8.88269 5.25721C9.06541 5.18153 9.22159 5.05335 9.33147 4.8889C9.44136 4.72445 9.5 4.53112 9.5 4.33333C9.5 4.06812 9.39465 3.81376 9.20711 3.62623C9.01957 3.43869 8.76522 3.33333 8.5 3.33333Z"
      />
    </g>
    <defs>
      <clipPath id="clip0_1437_5194">
        <rect width="16" height="16" fill="white" transform="translate(0.5)" />
      </clipPath>
    </defs>
  </svg>`
export const circleCheck = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" ><path fill="currentColor" d="M512 896a384 384 0 1 0 0-768 384 384 0 0 0 0 768m0 64a448 448 0 1 1 0-896 448 448 0 0 1 0 896"></path><path fill="currentColor" d="M745.344 361.344a32 32 0 0 1 45.312 45.312l-288 288a32 32 0 0 1-45.312 0l-160-160a32 32 0 1 1 45.312-45.312L480 626.752l265.344-265.408z"></path></svg>`
export const loading = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" ><path fill="currentColor" d="M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32m0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32m448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32m-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32M195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248zM828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0m-452.544 452.48a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0z"></path></svg>`
export const iconPropType = definePropType<string | Component>([
  String,
  Object,
  Function,
])

export const CloseComponents = {
  Close,
}

export const TypeComponents = {
  Close,
  SuccessFilled,
  InfoFilled,
  WarningFilled,
  CircleCloseFilled,
}

export const TypeComponentsMap = {
  success: check,
  warning,
  error,
  info,
}

export const ValidateComponentsMap = {
  validating: loading,
  success: circleCheck,
  error: warning,
}
