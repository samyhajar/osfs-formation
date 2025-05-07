## OSFS Formation

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) and integrated with [Supabase](https://supabase.com) for authentication and database features.

## Getting Started

### Setting up Supabase

1. Create a new Supabase project at [https://supabase.com](https://supabase.com)
2. Copy your Supabase URL and anon key from the project settings
3. Create a `.env.local` file in the root of the project with the following content:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Running the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

The project follows a structured organization:

- `/src/app`: Application routes and page components
- `/src/components`: Reusable UI components
- `/src/lib`: Core utilities and services
- `/src/hooks`: Custom hooks for stateful logic
- `/src/services`: API calls and data processing
- `/src/types`: TypeScript type definitions
- `/src/contexts`: React Context definitions
- `/supabase`: Supabase configuration files

## Technology Stack

- **Next.js 15**: React framework with App Router
- **Supabase**: Backend as a Service for auth and database
- **Tailwind CSS v4**: Utility-first CSS framework with @theme directive
- **TypeScript**: Type-safe JavaScript
- **Zod**: Schema validation library

## Database Migrations

To apply database migrations:

```bash
npx supabase migration up
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

```
osfs-formation
├─ .cursor
│  └─ rules
│     ├─ database-functions.mdc
│     ├─ migrations-supabase.mdc
│     ├─ postgresql-style.mdc
│     ├─ rls-policies.mdc
│     └─ supabase-edge-function.mdc
├─ .cursorrules
├─ .husky
│  ├─ _
│  │  ├─ applypatch-msg
│  │  ├─ commit-msg
│  │  ├─ h
│  │  ├─ husky.sh
│  │  ├─ post-applypatch
│  │  ├─ post-checkout
│  │  ├─ post-commit
│  │  ├─ post-merge
│  │  ├─ post-rewrite
│  │  ├─ pre-applypatch
│  │  ├─ pre-auto-gc
│  │  ├─ pre-commit
│  │  ├─ pre-merge-commit
│  │  ├─ pre-push
│  │  ├─ pre-rebase
│  │  └─ prepare-commit-msg
│  └─ pre-commit
├─ .next
│  ├─ BUILD_ID
│  ├─ app-build-manifest.json
│  ├─ app-path-routes-manifest.json
│  ├─ build
│  │  └─ chunks
│  │     ├─ [root-of-the-server]__04d7a048._.js
│  │     ├─ [root-of-the-server]__04d7a048._.js.map
│  │     ├─ [root-of-the-server]__05f88b00._.js
│  │     ├─ [root-of-the-server]__05f88b00._.js.map
│  │     ├─ [turbopack]_runtime.js
│  │     ├─ [turbopack]_runtime.js.map
│  │     ├─ postcss_config_mjs_transform_ts_f0ffbaad._.js
│  │     └─ postcss_config_mjs_transform_ts_f0ffbaad._.js.map
│  ├─ build-manifest.json
│  ├─ cache
│  │  ├─ .rscinfo
│  │  ├─ eslint
│  │  │  └─ .cache_t3k93v
│  │  ├─ fetch-cache
│  │  │  ├─ 04d58910134a9d219827b4573dd3110569aa332c730b3c6e5d5b94fe823edf9a
│  │  │  ├─ 08a9bd40364cd239943445b5bc6d46f4c43b80b52146948ba789462fb427933d
│  │  │  ├─ 09897803dca1272eb5b72c7def540ff03ca6ccafea89f1b3b24e59c6dcd4f191
│  │  │  ├─ 15123e1f8dc3f2ce0e1fc3062a2c2137afccd8eac4201f7e8c7f43f27401bf2c
│  │  │  ├─ 18ab7f6e71e9219123f66a5685fe35b8648e0e91648b30f381ff8c7201d47cae
│  │  │  ├─ 1bd86ca6b0ed3a47c75e407d460c6cb36a02bb7023124d0c527fff312e7807fd
│  │  │  ├─ 1e14ead18adecbca25fe03fea7344586abde2339c1839663ae3541c00e6d22f9
│  │  │  ├─ 2216c5aa123b6d45edda98d0d27b97d1e16ecd0ce49c84a3b96f3e0528b2f438
│  │  │  ├─ 2cc4ec78043a56a93cb501c63038445ef15c1472c8dbe7201c5862244057b0c5
│  │  │  ├─ 2f4908ec4f464d26c3357868353109fcb7cd70490763ffef2af52ec8e86d58d6
│  │  │  ├─ 2f7c4a9354c118536925227935063c7146b51931c9ee6782067bf28f2190d3fe
│  │  │  ├─ 2f801117e77b25dc772651fbc67ccab212e427fb5b011c5bfba3337903d627ae
│  │  │  ├─ 3966bfb16f031fd5bda346cbed24b7c797bf054f1384e87038d67531cb2e11c4
│  │  │  ├─ 43f1e67b41bb93ea3223db2ffcc193478b1bcf5864765ad1ee3aad094c10c67d
│  │  │  ├─ 4e54431dcf5caadc6512ecb226cf87b8ba3af57fb84a64ed2ef9de10bdc5e795
│  │  │  ├─ 5fdc2f53ac4c7c59fce467f79e25a609326b54ab8c76f3320e973ce75bc31f0d
│  │  │  ├─ 6b4ab81381f152167bac06ad5db20d5ba55053ad2780b7940d2cd2a6830d3aac
│  │  │  ├─ 6cff6195de522664fe4d30ae184812929d3c00f93575def51663b5f6ffcf4d24
│  │  │  ├─ 71b1defc47583546b19863e084e532cedb806b0319b7626a72dea97bb777d83e
│  │  │  ├─ 78db46529bac2c485e6fae548c78d695ba5ea4d2c7c01bd8bc6597d1bdd6e31d
│  │  │  ├─ 7f68de837ffdecfd7cf590f663e68b1ad415472d36f89ac0b1519aec9af90e2d
│  │  │  ├─ 8e118af182efdd61617b5e8c3cc885882b590f9283ca3809435bdf6a839a93cd
│  │  │  ├─ 9ac5187000294a04a023b84fa92c53f4066977cbbbee730a685a0ff216e691ce
│  │  │  ├─ 9b115e389523da746a81a32beffea0c11d605182e1a0eda99c2b114d049542c2
│  │  │  ├─ ad40466b343d7f9cdd7946c3f3a0dc8f5810aa4672d082ee389e02bc43b2f388
│  │  │  ├─ b42b33e50411f36e27815240e3534cd3bda57b1d89ace03582eb0f1691aafae2
│  │  │  ├─ b8e1d8761d6305e74b25a662f423477fcb7b20af944808c997e939a921222534
│  │  │  ├─ bfd76e3a803e0a50e307e9207d5133c0a17b610ca7d7010abb68e6e8d32e9ca8
│  │  │  ├─ c6741b88bbedf315fa9636fd98202669676206aa5339eb64da92fc0b3eeafb61
│  │  │  ├─ cd8b840923fa0ccb7d6bd16fb7ca989692532b470b3fd45b22e5329ce8f171b3
│  │  │  ├─ cf7dbad9c9469c01b10749a76bc3180978e3ae2ef796407c045b2d57da97e78c
│  │  │  ├─ d50fe47a0b125f867b638a1bf7e0f3232b2de9d65fc91ae5bd3cb4c82968a7d7
│  │  │  ├─ e400149c3608c15538f0e1a4880b1b442ab86a9e3e50bd032ea8be339884c4ee
│  │  │  ├─ ee01d4cf37d331a938a081d255c30bcac5750140c589edb61379a7616deea8dd
│  │  │  └─ fe5318db3c0dfe328e1d79d47a36f3beddfb47794c8aa92b3b7b33649f430a30
│  │  ├─ images
│  │  │  ├─ -V59vBzNatipPeESMe-syx8q2WjNGmGrfWmmIyztv-8
│  │  │  │  └─ 31536000.1777738778919.0DPzO_KR-Xn2k9RTKn91ZHbqiM3D1Cfw26-Mloc1MqY.IjY3YmE2MjI5LTRhNzci.webp
│  │  │  ├─ 0-pH34DuaUa2WWU9PdF0WjTn6AjCV1bGp8X48R_tEVM
│  │  │  │  └─ 31536000.1777737830158.IsneqPeM2vLKke6ZH2e1IHUBD5Jk6ReURO-YVG2CTJY.IjY3YmE2MjJhLTljZWEi.webp
│  │  │  ├─ 0uWl1mXXngenjjt6cNMHrpC6NrepeOh1f8SkUuZexYQ
│  │  │  │  └─ 31536000.1777737830253.B7RpOvwCW3_YOZpRG5GomkWhfcIkpn0l9mghttCyTVE.IjY3YmE2MjJhLTVmNDUi.webp
│  │  │  ├─ 0zSwWk-KLTAMQjel_xOo5fUZHjRM0PyLUSFyXz3HYnI
│  │  │  │  └─ 31536000.1777737699407.8TFmgaBJbxGnHh8A4HbgVx7_WSIbIe08aBdDm1xQtL8.IjY3YmE2MjJhLTk4N2Ui.webp
│  │  │  ├─ 14pBVhSMg0IXFAg5s9et43kP1wP3y3nNNMRiCKFWJLE
│  │  │  │  └─ 31536000.1777737833154.StbA-CE5QRHoNL__hcOiryZFDzuKN3i92f8scoFYz0E.IjY3YmE2MjJhLTFmNDUi.webp
│  │  │  ├─ 1JZI8fbfqKwJKl6cgedEASBLcj_TjJgP0ioad0n5yz0
│  │  │  │  └─ 31536000.1777737832891.L8OZBSUYMPGuXLfB6yrd4cLr5f6-jy8W7SADIid8-1I.IjY3YmE2MjJhLTQ2MGYi.webp
│  │  │  ├─ 1uADZb3rNpBb01sGLbBZlJZYXuzeSDv4V3IjsnNqq_4
│  │  │  │  └─ 31536000.1777738778986.L1UeqjzO6xaLGNbQG8zWPpQPeDFn1VLPRNEhLEAlVUA.IjY3YmE2MjI5LTI3Nzki.webp
│  │  │  ├─ 2dNb7TaFiDaOGf9XwGadxNUfn7BpDc8rxlNr5w6bQLw
│  │  │  │  └─ 31536000.1777737831582.KdIOyo_SM4UlGtJUIxoYlfwuff_0-p_uzeJe30UJVGc.IjY3YmE2MjI4LTE1Y2QxIg.webp
│  │  │  ├─ 2oW-NmDdt9uni3QC4wO3Z0fqiKexIuL6arF5Dzc8-LE
│  │  │  │  └─ 31536000.1777737831030.eTdaf6Mv5jfykNuVoMrOMLCTmJHirxPSYbAItt1FEu0.IjY3YmE2MjJhLTJlYzYi.webp
│  │  │  ├─ 4BvuN9lXS1fGfCs6iHgSq5CO0UivqI95Cpf79ANZvbM
│  │  │  │  └─ 31536000.1777737833320.Nt1zI1AzIz6MNfa9ozRlk1rHddkigXajcgI1qzdptQU.IjY3YmE2MjJhLTIyNjMi.webp
│  │  │  ├─ 5f2FQyiFof2TkfLf1YwyTnHEVO6B_x5uE2Ctn3NYPfQ
│  │  │  │  └─ 31536000.1777737830919.sL3Z0peXVR7xXCRgbU3jT3rZr80HhbHvsbrLav4VPHA.IjY3YmE2MjJhLTM5ZDYi.webp
│  │  │  ├─ 6r6IAFjfuYtNgDUgRmc0lfruU9AG2lEmIoKmx7KsA5w
│  │  │  │  └─ 31536000.1777737831907.fyeOc0JEQge1QEUNcGDmSoQbWWKuOWEFmq2Okvgcmlo.IjY3YmE2MjJhLTY3YmIi.webp
│  │  │  ├─ 7Eyp2aBQVg5iUSp4_RATPGLH090832OyhWAO3u5Y_vI
│  │  │  │  └─ 31536000.1777737832945.1d1QfRAzBOYWwLTrXk5Y2Xt8_8k0ei00LbPyAWvY4Hc.IjY3YmE2MjJhLTQ0N2Mi.webp
│  │  │  ├─ 7xPVIhSLXU7OL33R7_PpSjkHVSknhySBnukNwt-Szdo
│  │  │  │  └─ 31536000.1777737833456._nilFZndI1bM-AnjIF06feHozVSfysheSj-ADLY3GUw.IjY3YmE2MjJhLTQ2MGQi.webp
│  │  │  ├─ 8myghIST9poeeNrTLZQXDk2uB3Iy3ExFwGUHitpVcJ4
│  │  │  │  └─ 31536000.1777737833074.IOrzlEW-mpBe8WfVb_9LGMb0NGdRAAypVGJK4aWk7l0.IjY3YmE2MjJhLTlhZDQi.webp
│  │  │  ├─ 9nsq-yDtSd_OHRbNbrVTKAnGT9WJi0paCzuVpi6U8xM
│  │  │  │  └─ 31536000.1777737830590.F7eA_UFqfxvvqcZyPtERH3o4VnVslHFJ3cydQAToglg.IjY3YmE2MjJhLWJlNDgi.webp
│  │  │  ├─ 9s7fcLU-uC_NzfcPMv1tONCnOtNvPhNEwlRW1farQ1I
│  │  │  │  └─ 31536000.1777737830925.ccZCwByomv8835P2SQCCL1bnSJn7xRpquk3O4rAnkoM.IjY3YmE2MjJhLTQwMDAi.webp
│  │  │  ├─ 9vTzExnAcED5VZkVBuF6svW9MM0D6iJkGEYbs5C8zeA
│  │  │  │  └─ 31536000.1777737830494.tN7JmUIvJVFpE9569DU195qnfszr_CNfmqEhcSwuoVo.IjY3YmE2MjJhLTY4ZWYi.webp
│  │  │  ├─ BFDYeD0T9BcM_YBhf3BSJk76b1NBVRcr7e6l1W-jEVQ
│  │  │  │  └─ 31536000.1777739165661.cGfUgU6ulzMQ8lmLupxPDnmLEcGY8hKa1hQrJyr9VPk.IjY3YmE2MjI5LTZlZTYi.webp
│  │  │  ├─ BcJ84E7NFLcQyJseJyAdy8rWi152cHfiQ2V90B6o9dc
│  │  │  │  └─ 31536000.1777737830750.-reOHqetoGdvfQ5Zp6Hzg2fxgukDixcy5XxgwDYzaUY.IjY3YmE2MjJhLTYwMGIi.webp
│  │  │  ├─ Bq7Fjf6rJd64MbXMsrDQZ06VeOU7F4-tjNaKvSproeo
│  │  │  │  └─ 31536000.1777737832252.vNh1YW-jYv_uIB7ifin6oLWBVX-9mYV-D3gKF1QbVs8.IjY3YmE2MjJhLTRhYjci.webp
│  │  │  ├─ CH7sirrOpRiHkmntkn-u-7oH3ifH28CmvE_i5TuoWlA
│  │  │  │  └─ 31536000.1777739165438.-ptDH9BTAxOT2dJDx3Lfx36_rIkh3GvKsHqKDMOooyk.IjY3YmE2MjJhLTdkZTAi.webp
│  │  │  ├─ Czz9BrADb_2UfFcFgYN9s6OwFeIlKSK274zEU2qbwT4
│  │  │  │  └─ 31536000.1777737831648.BakJQXjlMq5g2FCDtTWSdWUZqOeIX98hoh7J-18Rlvg.IjY3YmE2MjJhLTNjZGUi.webp
│  │  │  ├─ Dl74DyV9eqep0Yb2C2EgaDxDWCsQlnFyJMY-maaU1tc
│  │  │  │  └─ 31536000.1777737831668.ldNSBrI-GevtpZASBQkdQ3NNjXjjFR0XYhCh2vPJPUA.IjY3YmE2MjJhLTQzYTki.webp
│  │  │  ├─ DwMgKetnGzsjn312oJ0zHelkrLiWQpI_ZQmkjWkVDTw
│  │  │  │  └─ 31536000.1777737830417.KptHowEXzfxWrb_hJme3lt6eIMYhGXVYBMzxWMCaSy0.IjY3YmE2MjJhLTM4Mzci.webp
│  │  │  ├─ ElXOo_BLWrw6Auqwjgx-4ej0w5LiOCZPDZhqjgYYDxY
│  │  │  │  └─ 31536000.1777737833341.4-ByWgOm5dHlMwsYf8tFpCilX8nXKYpb_0TQIxULaYU.IjY3YmE2MjJhLTFlMmEi.webp
│  │  │  ├─ Fd4DTZkB-etAoeeAoRw_-EkViZnt-xaLWT0CzAEH4TM
│  │  │  │  └─ 31536000.1777737833478.R9Zjo7y0nSR3ZTPlkIZ7LLGn7SqqiKG5S2nUnuRfFSw.IjY3YmE2MjJhLTQ4NTIi.webp
│  │  │  ├─ GMwuawDY2ucPA9X5GHe9PICG7AyL7kATMMDlavmBr-g
│  │  │  │  └─ 31536000.1777737832501.aBoEBWgXOTubVnrsmNzWgweooX1ZAMH2Yr_ttmfwWVU.IjY3YmE2MjJhLTI4MWIi.webp
│  │  │  ├─ Gc08aJQeOxf5C2mRnXSlaLVMICC3aDOXjjLPrPkhrgw
│  │  │  │  └─ 31536000.1777737830093.euva7QJBDQA2uduz3BLJJf9iXmyu4uSYyLPqGKiEFLA.IjY3YmE2MjJhLTNlNTki.webp
│  │  │  ├─ Go8gEEHjEgTr-zNFCvPTMGCH2w2VTwpxieXZb19o8m4
│  │  │  │  └─ 31536000.1777737833306.GQxZXLtFT4Rbgto0NrmPLQUnOuE7iQb9u8zBZeKDhgs.IjY3YmE2MjJhLTQ5MDIi.webp
│  │  │  ├─ IIVILLgFHXwAQAXU9Jb_nNekJ-IDN5OEbjQuFzgNL4s
│  │  │  │  └─ 31536000.1777737831442.j3tJGsH4w-9-npNcquwRZ7MPtzrTjY3GV5O4HRwtWL8.IjY3YmE2MjJhLTNhN2Qi.webp
│  │  │  ├─ IyUBYZgYIw2gMYuZ3lxsE4qX6CclEhYjz8c0PozmLhk
│  │  │  │  └─ 31536000.1777737833418.jiKP5fYBan8szkfe17XRnXxiyUZTKzGoNVGQ5WRnrvg.IjY3YmE2MjJhLTcwYjUi.webp
│  │  │  ├─ KVse8DGM_R-t5op55lshPd03dKLIc4AiXJbEA3e4kRM
│  │  │  │  └─ 31536000.1777737831298.2IDA1bD5whXYhgpue4boqulXutNB7bTs5f33kOa52VU.IjY3YmE2MjJhLTdkNGEi.webp
│  │  │  ├─ LFdhWB71BQh0jwOvy3BiSUJO2-H6fReNmtufl1ZqofA
│  │  │  │  └─ 31536000.1777737831870.IxckeFiREvs9Aq4LTpzBqoDR71-b0n4aKmx07PAO8mI.IjY3YmE2MjJhLTNkYzkwIg.webp
│  │  │  ├─ LLQJ-OH_oM5krsXz_sQQ5_pDiO3xoC-9mcLVds4aPqI
│  │  │  │  └─ 31536000.1777737832925.ZFCyPoc3b62VTjXc6ESY4aFzTWZS7Tm5SC3RIXzpYgI.IjY3YmE2MjJhLTQ1YjUi.webp
│  │  │  ├─ Ln_dN3c6wmbpWTolCmplJHhqQjH6XWpptmGQ1DxEN3c
│  │  │  │  └─ 31536000.1777737832797.mrG35mjV8Cnai38kDraoqIIyKWrv4OkxmMAH7EhM_mc.IjY3YmE2MjJhLTYzY2Ui.webp
│  │  │  ├─ MnZq4nReXcQGbcvIDurrJCOEPjRqqji_qW9KCeas1qg
│  │  │  │  └─ 31536000.1777738778886.lYAjqNIrRUtYPTMB4Vwo1cPKLBmQ1YBIOCziIUCO3Bs.IjY3YmE2MjJhLTQ2YWIi.webp
│  │  │  ├─ NDS_yQv8YucC_SRC4e7NFwNsQln7cxkgbLMNh9btR6c
│  │  │  │  └─ 31536000.1777737833316.th6IvnJ3owOERUGSgdy7rnTtAbTnYkC3XZnEUVF2wR0.IjY3YmE2MjJhLTUwMDYi.webp
│  │  │  ├─ NIwNqy0i83ihhsgZOrGVb_5J2z4UeLOelWzqs2FNSoQ
│  │  │  │  └─ 31536000.1777737830653.uh1ymjlvA1-RHoWavRAwnBVjHB60b0PYToqwnqvkQtM.IjY3YmE2MjJhLTVlMDMi.webp
│  │  │  ├─ O8LjrTkC4-DXUh3_L44y2Ydzx4949jCb-Rmki8cfyWA
│  │  │  │  └─ 31536000.1777737833125.ny7tEP74ewbsVAu18BHcRQyMcOeLHGoSSkdQBmmBVlU.IjY3YmE2MjJhLTliY2Ei.webp
│  │  │  ├─ OUVH3mqp8WIb4Ii8SCdtmPTdQYSpV3sVnO9KNfzkMXw
│  │  │  │  └─ 31536000.1777737833149.VtKMmkP93JCDoBGrzfBCsby4Be4YCDy7PlBAJ9VQLLw.IjY3YmE2MjJhLTQyZjQi.webp
│  │  │  ├─ OYsit9HKUKgXYWJY6VKdbC4i9EYEab-mVKlhqtgBDmU
│  │  │  │  └─ 31536000.1777737830853.HRQ7GuodAvR1Mk9uHKPVUYg21LQbeHjxLN7RPXj2NRA.IjY3YmE2MjJhLTU1NzQi.webp
│  │  │  ├─ OseFwiYooSvfSRl5MYvJFSVQAZMtGO1l2VF-TgGAnpI
│  │  │  │  └─ 31536000.1777738778915.2I9HfMyvPtJW_ytCsXbyEqc3VtVTc6ePuw8RJ2w-Zo8.IjY3YmE2MjJhLTMyZWUi.webp
│  │  │  ├─ P5W-ssXN8Sg9AqgcaadGghOPasl4ivbaHqsTVcMM2oI
│  │  │  │  └─ 31536000.1777737830649.XXgYabv1S-_K9QSKKUikUfrRW_AFseHaustUrDz6Vck.IjY3YmE2MjJhLTU1ZDEi.webp
│  │  │  ├─ PCTZKeoP9vTkiCVQ4_FVPM_7IOJCeEtsGJ0oZ1H97J8
│  │  │  │  └─ 31536000.1777737832052.gJSBBDm2jRFsIF_Qwxz5yPmnq0sHy4krCy8DK51sMZI.IjY3YmE2MjJhLTRhM2Ei.webp
│  │  │  ├─ Pfi9cQ0FYm4IHw_Vc5OUF6iIJzpfNexTVvmYIHGalrM
│  │  │  │  └─ 31536000.1777737831143.WKM_HAKHbdopLD5_-oeDI4yNJ04D4hqiKXmjs89VqzY.IjY3YmE2MjJhLWZlMGMi.webp
│  │  │  ├─ Pvs6ULpP8uuIl4ishc5vdc6JVsH5NmV9coiUUXPKHFk
│  │  │  │  └─ 31536000.1777739165610.K7nEgj7rfXLfcFFmqruG-7vZbdYkJg2jsJOEVTV-Bqo.IjY3YmE2MjJhLTQ2YWIi.webp
│  │  │  ├─ Q6uZTa8s8axX6en39HwAsAuZM-3Q7rv4tPQXFUGu6RY
│  │  │  │  └─ 31536000.1777737830746.WTdcyJWbm89bsXFRtAjJPTpUgBJ3YYr1CiDU4caFIvA.IjY3YmE2MjJhLTQ4ZjEi.webp
│  │  │  ├─ QR62w9vZdCVwGv7pWbOeDoMla0EpDnlgdjuLOA3YWP0
│  │  │  │  └─ 31536000.1777737831664.060XvpJfAmGPiOdkd-oHGeKvGkMgNMN83pKcsjNQMuo.IjY3YmE2MjI4LTI2OWMi.webp
│  │  │  ├─ RSksaNXvlIxcIIh0TcTvN2ZKZIQrE8MM2YgHMQAh5Ko
│  │  │  │  └─ 31536000.1777737833419.vebsYCPY1tm7R314eynTgYtTibzaNUCeUHmgqQqHWwo.IjY3YmE2MjJhLTM5ZDMi.webp
│  │  │  ├─ RbphS5CbNi5eLocWlPTS4lXaanxcrztMjFx6RAeN4DE
│  │  │  │  └─ 31536000.1777737829849.2KqHOs_IfDLpyizo0Vhq6svfCbLndp3ZHJExRDBcEj0.IjY3YmE2MjJhLTcwMmIi.webp
│  │  │  ├─ TKH30VN5HonzEP2N6s4Qdem2QB-7-FcN_iLrHbtHiuk
│  │  │  │  └─ 31536000.1777739166314.7C299hsuMErd06M6T9Akn5aWMAvYZJT4skGBDrzlqdg.IjY3YmE2MjI4LWEwMjAi.webp
│  │  │  ├─ TwusxkvnWeeVpCZbltDcXZbk_IgAByO7k8PI0c7R-ao
│  │  │  │  └─ 31536000.1777737833130.HRPY8jqsUdGIJxM1fr8XdAKXrtUbuEMjbUOsH1dk8iY.IjY3YmE2MjJhLTFhYTAi.webp
│  │  │  ├─ Tzr8P5HEKf9VQ1qOTfZ20nByCrbg11yeBY5uHvluATg
│  │  │  │  └─ 31536000.1777737833069.1Zlaffp8h_eePCioxTwSfGgzITXMSCCJeDO83-uVKYw.IjY3YmE2MjJhLTE4MTUi.webp
│  │  │  ├─ UiHGV6LXjly6D5XOy5aR-DiylZdpwGPKh1sT7IwsGCE
│  │  │  │  └─ 31536000.1777737830422.2Rh7NKmLKs07BGT_CIT7Muxo2GNrWbxl9De-LYL_vXQ.IjY3YmE2MjJhLTMyYWMi.webp
│  │  │  ├─ VT7hAPJK8289qvgckb7OWIgCmvAMkwXs4P5kUjwWOVY
│  │  │  │  └─ 31536000.1777737833071.hqIl74wYNtuscBmlUgnNVeE37JtQNTHgqg8-xqvO40A.IjY3YmE2MjJhLTQ4NGMi.webp
│  │  │  ├─ VmmB1tAfak0O-C_HB-X-gWPVSbTICdg4v8oHisRx5d4
│  │  │  │  └─ 31536000.1777739165665.BJX3rO_0mjMsO2Li3WhoWxUUqXD4Dn9FU6nG59zdeKg.IjY3YmE2MjI5LTI3Nzki.webp
│  │  │  ├─ W9pbseMAaFkJ6PM0qbhP6zDX_KjU2CmsXBtSoDCrdEE
│  │  │  │  └─ 31536000.1777737830220.aUGQ2OjSDJKCXpTScG2b3-v7LHicGsb32iYmxrK1zZk.IjY3YmE2MjJhLTM2MmIi.webp
│  │  │  ├─ WCtzIWG4nRCdTmHORrOtN4KsIDvYVDvXZve5ZTmXVB0
│  │  │  │  └─ 31536000.1777737832912.ytTZFz3A6Z4cfFFYEjExzZuHT4etYO2T7Be9wJ90CP4.IjY3YmE2MjJhLTUwNzYi.webp
│  │  │  ├─ WEOLPPWl_GkKQNli5VFydmSeKWzDzym7JRw8x6QSp1k
│  │  │  │  └─ 31536000.1777737833299.Y30_sAD4o2-yQ0HyPTpSNZ3xQsEKzItvAelH4UZdsVw.IjY3YmE2MjJhLTE3MDIi.webp
│  │  │  ├─ WbqHyRo22USa3TuEki3ZEj9aETQfIBymY7xaMr4QcqM
│  │  │  │  └─ 31536000.1777737830562.25SK7OtabjKqZ-vaN0iWMkWqdnJeVTIqegHtnkxBH0A.IjY3YmE2MjJhLTU4NDAi.webp
│  │  │  ├─ Wqkzw6fqJaWUaGk6kHIRKS-AldMxKCOJGSuJ8L_NyxY
│  │  │  │  └─ 31536000.1777739165497.vMQ1hxFhrdimVmNvh7HYaf7NowJTtCcxc8sZcwqvR9M.IjY3YmE2MjJhLTMyZWUi.webp
│  │  │  ├─ XmSeAhok4cNgu9Lvy0YX6P5oQuJCtjC8UXv7Cwgh8uI
│  │  │  │  └─ 31536000.1777737832383.PFyBGJKPXl2JLq2ZrTz5UlbaNDVdRCUaKfo9CijZmYU.IjY3YmE2MjJhLTFjNTYi.webp
│  │  │  ├─ YJhpj7YkQV_gLUKsUjMsnYp80mHiG6MAxikkGFBc6co
│  │  │  │  └─ 31536000.1777739165438.M-Mny8ZXgEu3340q40r4JV2312ZakT4qaD-Fx2EvlSA.IjY3YmE2MjI5LTQyYTAi.webp
│  │  │  ├─ YPXYeSEOtov8vNfbtpNACsMCMMs5hAli5XZb2Vbr3x0
│  │  │  │  └─ 31536000.1777737830142.szWkeWSEBcIQwdoprFLFAlQ0Bbp6ezO9pViacm7jom8.IjY3YmE2MjJhLTQwN2Yi.webp
│  │  │  ├─ Y_BUvFkxFOwYwgXEP9yUJvAQMcKRKBFBitBtlA4QSaI
│  │  │  │  └─ 31536000.1777737833224.0V7RELNgscYrZTEKNd6sMxkfzGKgudYwujPaALK4Ibs.IjY3YmE2MjJhLTU4MTEi.webp
│  │  │  ├─ YmX76mwx28FzQeMAb--o_tUBZfceDpycE1uPR3xVE0I
│  │  │  │  └─ 31536000.1777738778888.aUji3jwsw6eGbk7RALU6-qszHv8vxAtvVQamx_xEjSk.IjY3YmE2MjJhLTY0NDEi.webp
│  │  │  ├─ YrkENBQ-7S6zl89gaCsat2SulB53OQzj-45GdZjkJqo
│  │  │  │  └─ 31536000.1777737830767.DlCZJs4L_LThuas9h8OxkjtHf59w0-UpV-oivADz47E.IjY3YmE2MjJhLTNmMzgi.webp
│  │  │  ├─ Yz4NfIamaUkVGETAqYls4qmXh1sH2fDJCzUPULwhr1s
│  │  │  │  └─ 31536000.1777737700210.OgmVYnF8ZsbwyOYyYpBdmvA202xuP-rnpgYaBEeC59M.IjY3YmE2MjJhLWIxYmUyIg.webp
│  │  │  ├─ ZR3ezWrPY5T2dU2vbwXVUGevetp_OPA6Jb-OfnhxTVU
│  │  │  │  └─ 31536000.1777737832055.ZWPl0RhmLFsGodnrUXvBh4ewBIQf7crs71_I7r9WJLg.IjY3YmE2MjJhLTRiYTEi.webp
│  │  │  ├─ ZbvNPX2Eb3BLEWn_q65Yh0cSVzeSZeUXEBND82U-kSY
│  │  │  │  └─ 31536000.1777737831298.mAr8WCrQTcw_Y5W93jZycqpCPiINFit24cHMF3jSS2k.IjY3YmE2MjJhLWU3YmEi.webp
│  │  │  ├─ Ze6jA8JUF2Z6dRwv_8RrD6sdV_oRuAPlLhUKoLTQR6k
│  │  │  │  └─ 31536000.1777737830305.xcj7HFaQLo7_pH1MXxxja8ffSwkBMaeG2MNqK8J4zAo.IjY3YmE2MjJhLTZmMzAi.webp
│  │  │  ├─ _3E3tbr0GmeA9q-dlLWb9iLkV00Ym_bPWyYah2xGRY8
│  │  │  │  └─ 31536000.1777737832399.6R-7Vr9Q90_Iw1fBR0HF8SgIVeOBFApgZnfZY3_x4o4.IjY3YmE2MjI4LWEwMjAi.webp
│  │  │  ├─ _PPl4xNA8quqyyLxgeXRrUynhJmDXxIG6heKJ-WGgY8
│  │  │  │  └─ 31536000.1777737830404.hbDLEKTYUsc7Mgbw2RjEV87nP5pnpWgoXIEA_kjJvXU.IjY3YmE2MjJhLTMxYzki.webp
│  │  │  ├─ a3Rex4oJvJO-oqSnJiw4Q4VA6gnjzjLblgvMU899AVU
│  │  │  │  └─ 31536000.1777737832571.WcvD_NuGYTG678pzHEYznYXLdPvrv_ZqYco0UDQ_u6M.IjY3YmE2MjJhLTNjZTYi.webp
│  │  │  ├─ aqLn7BNZHqPMmPfnH8DRE8wf7a7_ZSt_BHN0uFONZWU
│  │  │  │  └─ 31536000.1777737832611.-bGqtKLSyWk3x_96B_McrvXdmra2gLjt3ZtDq_p-21M.IjY3YmE2MjJhLTRiYmQi.webp
│  │  │  ├─ b4FrclYrfYr5z6_o7hSfoH1jcK9RQCIiPvgU3H451Pw
│  │  │  │  └─ 31536000.1777739165444.K5Boa7X-Cd7m0G52qo0HXaFiIiMpW-AERf6MNmucI80.IjY3YmE2MjI4LTI2OWMi.webp
│  │  │  ├─ bgg2cdLSc3z5sw9w5RdHwqE-zMH7dNlNdcBOz6XWJhQ
│  │  │  │  └─ 31536000.1777737831784.gjCp50pmHN6t-Y1BqTtL6ZDgawhfwF68VWi4AHyYTpg.IjY3YmE2MjJhLTg2MjYi.webp
│  │  │  ├─ bkQSXP-BAfC-jBRNEncoOB2qub4DL4x7Tzk_5t9xNxA
│  │  │  │  └─ 31536000.1777737830338.HngeZ48fBDuAQ8dz3-jHoevxtrIW7ZF_hbZDAAu76Ss.IjY3YmE2MjJhLTM5M2Ei.webp
│  │  │  ├─ cmt80fca5Oz8OWxtsn72zNA_TZG3KKE6voI7ZwLxeGk
│  │  │  │  └─ 31536000.1777737831432.JqrScvMcf8HBgIol-fJKCHgx7auDAWDn6YelJJvDV0A.IjY3YmE2MjJhLTM5M2Mi.webp
│  │  │  ├─ crE8GhG3TQXy6G49QtCH0vUdIfhAnkCJqp6Gi7okr4c
│  │  │  │  └─ 31536000.1777737831769.lPSQNZNivY9Q4dTeJcaNDkYx97B1SHzBX4Bgm6pKe98.IjY3YmE2MjJhLTQ2NDMi.webp
│  │  │  ├─ dcnLli4vyXSrCsaSzoRsIgzx4EyAOiKyIhtx4CBSkGg
│  │  │  │  └─ 31536000.1777737831283.qQJS74cUi49SaOXNBdnVPJNg_vnZmPStM_I32xLnCrw.IjY3YmE2MjI4LThhNmMi.webp
│  │  │  ├─ fA7Q3q2ugrUE78AuEkKBhXDqGOJlrOIw_NmGQKbbzEE
│  │  │  │  └─ 31536000.1777737699175.1-wysse-nRa_WA2ma3mwLt0HH1r2hym_tiJisNAjvwo.IjY3YmE2MjJhLWE1M2Ei.webp
│  │  │  ├─ g8VaWZYGKmaa8FkPUA1aCxaafMNBBtPHXQwyK4iE5Wo
│  │  │  │  └─ 31536000.1777737830578.R2Zi8F5GzLiOb-KMhbZRZrF4-gQzBAkMnHJSUczWWaQ.IjY3YmE2MjJhLTYwODEi.webp
│  │  │  ├─ h2CDHkBf_zYpcICDKbcRE50uebg53MTMOaq3rqky7jE
│  │  │  │  └─ 31536000.1777737832021.W-96qAL6XpThGSBXrzhL2YxBI12UV1wHLI7uRwrVM64.IjY3YmE2MjJhLTRkMjgi.webp
│  │  │  ├─ h2vf-DjfcY550T45ySzs6YRNtdgItyi8Qc4tyS-tifU
│  │  │  │  └─ 31536000.1777737699278.PS948sEC5sGF2rEMwCkHtcVtMWRvSdQzi9P2hhYub7U.IjY3YmE2MjJhLTYxZjAi.webp
│  │  │  ├─ iBdP5e8fg-SDRDRwmGy71vmt_zOPdRFN56N_X0_LZbQ
│  │  │  │  └─ 31536000.1777739165660.luVwajXQssZjyYL1lzAOtGJmYlZTltwSvlInguxhM04.IjY3YmE2MjI5LTRhNzci.webp
│  │  │  ├─ iFu3cosOsg1StRjGjqPpA1is4Fo86OND0eZWXFs0YjA
│  │  │  │  └─ 31536000.1777737832614.IEHjzWkC9GiZ3v1k9Dqdg5OxAK6pacOPrkFVTjKJ-dU.IjY3YmE2MjJhLTMxYzgi.webp
│  │  │  ├─ jYOFPecrtSpRvNOGmNdbqqn0XpbVn4pEC2LrcvPwmQo
│  │  │  │  └─ 31536000.1777737831891.EQUDQsic4mrsjShQfHp35mstqrKfwFl0skHpO74HRI4.IjY3YmE2MjI4LWVjMDki.webp
│  │  │  ├─ lFa-mRKvpqRQaGKghQ03Ii1pZt0lTKQs0Q4n6diOZr8
│  │  │  │  └─ 31536000.1777737831390.odbetQYadDeScDS542lPMPn3S1xzvNd6rYooUi6jRDM.IjY3YmE2MjJhLTJmMGQi.webp
│  │  │  ├─ llv2uLe_D5PwxYCL-oLvpTai9CRrfRx33cjIhkpXAQ8
│  │  │  │  └─ 31536000.1777737833156.a2V_3k8PDbuvpw-e7v6MPod-duIVp18XB7EhPSOFB9Q.IjY3YmE2MjJhLTRhZjYi.webp
│  │  │  ├─ mTT4d4mdGqiNq5IChtCu9JebTKr5WFwO8rQWxGV7q8E
│  │  │  │  └─ 31536000.1777738778984.bu8aOwjhIlhYJV5ELXdXBU4IhG5dYFoWHQDej9CqznY.IjY3YmE2MjI5LTZlZTYi.webp
│  │  │  ├─ n7YUVNTi2jjpRX51rLAthwtkcrTJcROZZPywjJJ09Gk
│  │  │  │  └─ 31536000.1777739165605.cOWCJDD4YMChTrJFG0VxCQQfMU415kYyb6WuBA3wKKI.IjY3YmE2MjJhLTQ1YjUi.webp
│  │  │  ├─ ngv85Q2Y1PDHWmkXecyYsOoowtWvb2Ds0YkvuJodQ9A
│  │  │  │  └─ 31536000.1777737833119.dvL0T7mzed81RFZuT9w8uxY95T0tWSIpseiq8rtGmyU.IjY3YmE2MjJhLTFhODki.webp
│  │  │  ├─ nlY8xuKi61ya0C7CZeferFk0VY5pKK0nxhnQZLIRUCk
│  │  │  │  └─ 31536000.1777737833021.18etBvKavOG72JCfzE9YtMPAYsVpwH735Fz1LZDlNDE.IjY3YmE2MjJhLTQ0NjEi.webp
│  │  │  ├─ o44tAwqa7sXb009CzyBPia68WpcLgC9AmKktj3bkZvo
│  │  │  │  └─ 31536000.1777737830486.TEwR6k4GpGXVTa8n3fXhVKPUlzexrdi0celg7dyX2fU.IjY3YmE2MjJhLTQ4ZDMi.webp
│  │  │  ├─ pDguzQrpgzoLoP8GgMb6C08xuK7nLv78kEC3_Ir47yk
│  │  │  │  └─ 31536000.1777737832832.iLO5gUXRb_DmEUz3nZwjw6KWR2ystGn1aKvEfSRHuTQ.IjY3YmE2MjJhLTU5ODYi.webp
│  │  │  ├─ pH79cgwo2wDWGCC4FX1dh9l_qbSWS_1LXUC4GuNPacs
│  │  │  │  └─ 31536000.1777737832824.pVKzoH_6OGwNOKXfeCVW8ueqTe7L7W866XAc-YhOTZA.IjY3YmE2MjJhLTZiMmMi.webp
│  │  │  ├─ pJw5QbQ7A-XPkLQWFPiGGPNoWtEkW7qlKyMHozmxHQo
│  │  │  │  └─ 31536000.1777737830481.H1Mz7JqnANNtQj_0uXd6gQu_DUJLYapRImRQZz7GV8Y.IjY3YmE2MjJhLTRhMzEi.webp
│  │  │  ├─ pgH88ipRXD7tlusXZ6iygPVBUps15ulWhxSyYh8MGfw
│  │  │  │  └─ 31536000.1777738778922.0ocHDXV6aWU82N01YmH6SXV2OqJ2jprPKFLzqC30GVU.IjY3YmE2MjJhLTdkZTAi.webp
│  │  │  ├─ q0aYGTTzU20nIdEOX5f8oDnmhPNbhrn45mfxJZLAh10
│  │  │  │  └─ 31536000.1777738778900.lZ77DQbJQmB7_2m7Gi_fSbQdXLrV4ER_hz2SKEHYcxU.IjY3YmE2MjI5LTE4ODIi.webp
│  │  │  ├─ qS5kQYV1Mubsk9why1gtiUso4mJi4RhHZKq5_x18-9A
│  │  │  │  └─ 31536000.1777739165594.kmSuvrA3BFJr53V5XCVXPjMeEhjhXgyM8exOS1dJPAY.IjY3YmE2MjI5LTE4ODIi.webp
│  │  │  ├─ qlz4_kBYP8rH__XWE_wPnJuYg24oORsGZWr2bqtEFwE
│  │  │  │  └─ 31536000.1777737831529.G3XtqOFplNZLkyQEYZju4J6Fk-vRUaRZwH0I4sN0CiM.IjY3YmE2MjJhLTVkOGIi.webp
│  │  │  ├─ qzOajdBhmPvf2UNERqJaLjsFZKOUWuFTDo5P64hF2r4
│  │  │  │  └─ 31536000.1777737832641.LcmV2nwCNfFZwXsAjE7pK019HNBC59lIh_yowG1Q-eM.IjY3YmE2MjJhLTIwMjIi.webp
│  │  │  ├─ rCt8EXsAJwYKj_TyTvmu2jmQl_k3fgQPNm4Kv_G174E
│  │  │  │  └─ 31536000.1777739165490.FnwEUAW7d-difX0TqscWWLwXzJUfBlZDaCxGiFt0fqI.IjY3YmE2MjJhLTQ4ZjEi.webp
│  │  │  ├─ rOBjNMblhANLYUQhpQ7zhvJGCNK9VrnCCkTv5n2Kzek
│  │  │  │  └─ 31536000.1777737831019.Yn5RznyqXocoTL-Y7sPg9ukChhVBYGoPfrQ8p98kD0w.IjY3YmE2MjJhLTQ0NDMi.webp
│  │  │  ├─ sT1clWgd1CPKIIkpmh2WSekXYalQVeQ2yfX4O4czAzk
│  │  │  │  └─ 31536000.1777739165492.k19XXmd-9m0JHsRnUYRWT9sQIhI17S9QM_lkyc_P2NY.IjY3YmE2MjJhLTY0NDEi.webp
│  │  │  ├─ t38Dc13j5vtwUl96c1bYm_sYiZsq3_SAFpoIuLMpv_g
│  │  │  │  └─ 31536000.1777737833415.rBqdPT5qt5bK_eTQxv7eO4CmpxTHVOl6qmW67kXg5sE.IjY3YmE2MjJhLTI1NWUi.webp
│  │  │  ├─ u7zk-xabCI14F1W8hYdJ2nciBenqjkyN8o6_uAny9G8
│  │  │  │  └─ 31536000.1777737833332.qau5Wdy4SKrNEynmdV3EbFcOnoCGAanRS0X64s78vQc.IjY3YmE2MjJhLTgyMmIi.webp
│  │  │  ├─ uK8k79y9lUJRBUD_tSPklPF0qkbCbgtmpjOI3-5fV9E
│  │  │  │  └─ 31536000.1777738924841.DXPvw0b71WkqNtDRw3RoZlUYNx5Jbjtax9ZPKsEnv7Y.IjY3YmE2MjI5LTQyYTAi.webp
│  │  │  ├─ v6POhjRFc2b9BYUB_5bTyiCwgV6J36DUgcfbNH26Xwg
│  │  │  │  └─ 31536000.1777737831122.rZ8DcjELT4tfHn-Suqvc-Avan0X_SSqjJjjTYkcROu0.IjY3YmE2MjJhLTgwODgi.webp
│  │  │  ├─ vXm-J3sVYlQcCoOo6QHXUtGr9s8nn5IZ5H0CLg7OiQ4
│  │  │  │  └─ 31536000.1777737832827.TRRdZMe6F23ae0giPtNhVaWefCr9SF4EvX9w7pjPFl0.IjY3YmE2MjJhLTRhMGQi.webp
│  │  │  ├─ vpiiZjz-U0zSUSx4kghwIboTNmtq-F23TUxFa3GApa4
│  │  │  │  └─ 31536000.1777737830663.KWcUyIXl4neF2kxXUCoaElgucpkirOnXzju61iV7kug.IjY3YmE2MjJhLTRjZWMi.webp
│  │  │  ├─ wCt43B9toRr-Vz_Uc5nNDZ_BQojHlkx7hxycjRtvZBM
│  │  │  │  └─ 31536000.1777737833021.A7ox8mhO2adVXNMdlrY86nOQNKy6oKQN9wC85-FO_yU.IjY3YmE2MjJhLTdlNDAi.webp
│  │  │  └─ wEcC2SAPDfAVojuI7KqmWTgpcmbX2Wq-9ympqNQ10oc
│  │  │     └─ 31536000.1777737831588.5OAGgpoYYZ2PSsxfgppGHWb3Z4lkCKEx9kmFyX0RuBE.IjY3YmE2MjJhLTYwMTci.webp
│  │  ├─ swc
│  │  │  └─ plugins
│  │  │     └─ v7_macos_aarch64_9.0.0
│  │  └─ webpack
│  │     ├─ client-production
│  │     │  ├─ 0.pack
│  │     │  ├─ 1.pack
│  │     │  ├─ 2.pack
│  │     │  ├─ 3.pack
│  │     │  ├─ 4.pack
│  │     │  ├─ 5.pack
│  │     │  ├─ 6.pack
│  │     │  ├─ 7.pack
│  │     │  ├─ 8.pack
│  │     │  ├─ index.pack
│  │     │  └─ index.pack.old
│  │     ├─ edge-server-production
│  │     │  ├─ 0.pack
│  │     │  ├─ 1.pack
│  │     │  ├─ index.pack
│  │     │  └─ index.pack.old
│  │     └─ server-production
│  │        ├─ 0.pack
│  │        ├─ 1.pack
│  │        ├─ 2.pack
│  │        ├─ 3.pack
│  │        ├─ 4.pack
│  │        ├─ 5.pack
│  │        ├─ index.pack
│  │        └─ index.pack.old
│  ├─ diagnostics
│  │  ├─ build-diagnostics.json
│  │  └─ framework.json
│  ├─ export-marker.json
│  ├─ fallback-build-manifest.json
│  ├─ images-manifest.json
│  ├─ next-minimal-server.js.nft.json
│  ├─ next-server.js.nft.json
│  ├─ package.json
│  ├─ prerender-manifest.json
│  ├─ react-loadable-manifest.json
│  ├─ required-server-files.json
│  ├─ routes-manifest.json
│  ├─ server
│  │  ├─ app
│  │  │  ├─ [lang]
│  │  │  │  ├─ dashboard
│  │  │  │  │  └─ admin
│  │  │  │  │     ├─ page
│  │  │  │  │     │  ├─ app-build-manifest.json
│  │  │  │  │     │  ├─ app-paths-manifest.json
│  │  │  │  │     │  ├─ build-manifest.json
│  │  │  │  │     │  ├─ next-font-manifest.json
│  │  │  │  │     │  ├─ react-loadable-manifest.json
│  │  │  │  │     │  └─ server-reference-manifest.json
│  │  │  │  │     ├─ page.js
│  │  │  │  │     ├─ page.js.map
│  │  │  │  │     ├─ page_client-reference-manifest.js
│  │  │  │  │     └─ users
│  │  │  │  │        ├─ page
│  │  │  │  │        │  ├─ app-build-manifest.json
│  │  │  │  │        │  ├─ app-paths-manifest.json
│  │  │  │  │        │  ├─ build-manifest.json
│  │  │  │  │        │  ├─ next-font-manifest.json
│  │  │  │  │        │  ├─ react-loadable-manifest.json
│  │  │  │  │        │  └─ server-reference-manifest.json
│  │  │  │  │        ├─ page.js
│  │  │  │  │        ├─ page.js.map
│  │  │  │  │        └─ page_client-reference-manifest.js
│  │  │  │  ├─ page
│  │  │  │  │  ├─ app-build-manifest.json
│  │  │  │  │  ├─ app-paths-manifest.json
│  │  │  │  │  ├─ build-manifest.json
│  │  │  │  │  ├─ next-font-manifest.json
│  │  │  │  │  ├─ react-loadable-manifest.json
│  │  │  │  │  └─ server-reference-manifest.json
│  │  │  │  ├─ page.js
│  │  │  │  ├─ page.js.map
│  │  │  │  └─ page_client-reference-manifest.js
│  │  │  ├─ _not-found
│  │  │  │  ├─ page
│  │  │  │  │  ├─ app-build-manifest.json
│  │  │  │  │  ├─ app-paths-manifest.json
│  │  │  │  │  ├─ build-manifest.json
│  │  │  │  │  ├─ next-font-manifest.json
│  │  │  │  │  ├─ react-loadable-manifest.json
│  │  │  │  │  └─ server-reference-manifest.json
│  │  │  │  ├─ page.js
│  │  │  │  ├─ page.js.map
│  │  │  │  ├─ page.js.nft.json
│  │  │  │  └─ page_client-reference-manifest.js
│  │  │  ├─ _not-found.html
│  │  │  ├─ _not-found.meta
│  │  │  ├─ _not-found.rsc
│  │  │  ├─ api
│  │  │  │  ├─ auth
│  │  │  │  │  ├─ signout
│  │  │  │  │  │  ├─ route
│  │  │  │  │  │  │  ├─ app-build-manifest.json
│  │  │  │  │  │  │  ├─ app-paths-manifest.json
│  │  │  │  │  │  │  ├─ build-manifest.json
│  │  │  │  │  │  │  ├─ next-font-manifest.json
│  │  │  │  │  │  │  ├─ react-loadable-manifest.json
│  │  │  │  │  │  │  └─ server-reference-manifest.json
│  │  │  │  │  │  ├─ route.js
│  │  │  │  │  │  ├─ route.js.map
│  │  │  │  │  │  ├─ route.js.nft.json
│  │  │  │  │  │  └─ route_client-reference-manifest.js
│  │  │  │  │  └─ signup
│  │  │  │  │     ├─ route.js
│  │  │  │  │     ├─ route.js.nft.json
│  │  │  │  │     └─ route_client-reference-manifest.js
│  │  │  │  └─ create-admin
│  │  │  │     ├─ route.js
│  │  │  │     ├─ route.js.nft.json
│  │  │  │     └─ route_client-reference-manifest.js
│  │  │  ├─ auth
│  │  │  │  ├─ callback
│  │  │  │  │  ├─ route.js
│  │  │  │  │  ├─ route.js.nft.json
│  │  │  │  │  └─ route_client-reference-manifest.js
│  │  │  │  ├─ confirmed
│  │  │  │  │  ├─ page.js
│  │  │  │  │  ├─ page.js.nft.json
│  │  │  │  │  └─ page_client-reference-manifest.js
│  │  │  │  ├─ confirmed.html
│  │  │  │  ├─ confirmed.meta
│  │  │  │  └─ confirmed.rsc
│  │  │  ├─ dashboard
│  │  │  │  ├─ admin
│  │  │  │  │  ├─ documents
│  │  │  │  │  │  └─ new
│  │  │  │  │  │     ├─ page.js
│  │  │  │  │  │     ├─ page.js.nft.json
│  │  │  │  │  │     └─ page_client-reference-manifest.js
│  │  │  │  │  ├─ folders
│  │  │  │  │  │  ├─ [category]
│  │  │  │  │  │  │  ├─ page.js
│  │  │  │  │  │  │  ├─ page.js.nft.json
│  │  │  │  │  │  │  └─ page_client-reference-manifest.js
│  │  │  │  │  │  ├─ page.js
│  │  │  │  │  │  ├─ page.js.nft.json
│  │  │  │  │  │  └─ page_client-reference-manifest.js
│  │  │  │  │  ├─ formation-personnel
│  │  │  │  │  │  ├─ page.js
│  │  │  │  │  │  ├─ page.js.nft.json
│  │  │  │  │  │  └─ page_client-reference-manifest.js
│  │  │  │  │  ├─ page
│  │  │  │  │  │  ├─ app-build-manifest.json
│  │  │  │  │  │  ├─ app-paths-manifest.json
│  │  │  │  │  │  ├─ build-manifest.json
│  │  │  │  │  │  ├─ next-font-manifest.json
│  │  │  │  │  │  ├─ react-loadable-manifest.json
│  │  │  │  │  │  └─ server-reference-manifest.json
│  │  │  │  │  ├─ page.js
│  │  │  │  │  ├─ page.js.map
│  │  │  │  │  ├─ page.js.nft.json
│  │  │  │  │  ├─ page_client-reference-manifest.js
│  │  │  │  │  └─ users
│  │  │  │  │     ├─ page
│  │  │  │  │     │  ├─ app-build-manifest.json
│  │  │  │  │     │  ├─ app-paths-manifest.json
│  │  │  │  │     │  ├─ build-manifest.json
│  │  │  │  │     │  ├─ next-font-manifest.json
│  │  │  │  │     │  ├─ react-loadable-manifest.json
│  │  │  │  │     │  └─ server-reference-manifest.json
│  │  │  │  │     ├─ page.js
│  │  │  │  │     ├─ page.js.map
│  │  │  │  │     ├─ page.js.nft.json
│  │  │  │  │     └─ page_client-reference-manifest.js
│  │  │  │  ├─ formant
│  │  │  │  │  ├─ document
│  │  │  │  │  │  └─ new
│  │  │  │  │  │     ├─ page.js
│  │  │  │  │  │     ├─ page.js.nft.json
│  │  │  │  │  │     └─ page_client-reference-manifest.js
│  │  │  │  │  ├─ documents
│  │  │  │  │  │  └─ new
│  │  │  │  │  │     ├─ page.js
│  │  │  │  │  │     ├─ page.js.nft.json
│  │  │  │  │  │     └─ page_client-reference-manifest.js
│  │  │  │  │  ├─ folders
│  │  │  │  │  │  ├─ [category]
│  │  │  │  │  │  │  ├─ page.js
│  │  │  │  │  │  │  ├─ page.js.nft.json
│  │  │  │  │  │  │  └─ page_client-reference-manifest.js
│  │  │  │  │  │  ├─ page
│  │  │  │  │  │  │  ├─ app-build-manifest.json
│  │  │  │  │  │  │  ├─ app-paths-manifest.json
│  │  │  │  │  │  │  ├─ build-manifest.json
│  │  │  │  │  │  │  ├─ next-font-manifest.json
│  │  │  │  │  │  │  ├─ react-loadable-manifest.json
│  │  │  │  │  │  │  └─ server-reference-manifest.json
│  │  │  │  │  │  ├─ page.js
│  │  │  │  │  │  ├─ page.js.map
│  │  │  │  │  │  ├─ page.js.nft.json
│  │  │  │  │  │  └─ page_client-reference-manifest.js
│  │  │  │  │  ├─ formation-personnel
│  │  │  │  │  │  ├─ page
│  │  │  │  │  │  │  ├─ app-build-manifest.json
│  │  │  │  │  │  │  ├─ app-paths-manifest.json
│  │  │  │  │  │  │  ├─ build-manifest.json
│  │  │  │  │  │  │  ├─ next-font-manifest.json
│  │  │  │  │  │  │  ├─ react-loadable-manifest.json
│  │  │  │  │  │  │  └─ server-reference-manifest.json
│  │  │  │  │  │  ├─ page.js
│  │  │  │  │  │  ├─ page.js.map
│  │  │  │  │  │  ├─ page.js.nft.json
│  │  │  │  │  │  └─ page_client-reference-manifest.js
│  │  │  │  │  ├─ page
│  │  │  │  │  │  ├─ app-build-manifest.json
│  │  │  │  │  │  ├─ app-paths-manifest.json
│  │  │  │  │  │  ├─ build-manifest.json
│  │  │  │  │  │  ├─ next-font-manifest.json
│  │  │  │  │  │  ├─ react-loadable-manifest.json
│  │  │  │  │  │  └─ server-reference-manifest.json
│  │  │  │  │  ├─ page.js
│  │  │  │  │  ├─ page.js.map
│  │  │  │  │  ├─ page.js.nft.json
│  │  │  │  │  ├─ page_client-reference-manifest.js
│  │  │  │  │  └─ users
│  │  │  │  │     ├─ page
│  │  │  │  │     │  ├─ app-build-manifest.json
│  │  │  │  │     │  ├─ app-paths-manifest.json
│  │  │  │  │     │  ├─ build-manifest.json
│  │  │  │  │     │  ├─ next-font-manifest.json
│  │  │  │  │     │  ├─ react-loadable-manifest.json
│  │  │  │  │     │  └─ server-reference-manifest.json
│  │  │  │  │     ├─ page.js
│  │  │  │  │     ├─ page.js.map
│  │  │  │  │     ├─ page.js.nft.json
│  │  │  │  │     └─ page_client-reference-manifest.js
│  │  │  │  ├─ formee
│  │  │  │  │  ├─ documents
│  │  │  │  │  │  └─ new
│  │  │  │  │  │     ├─ page.js
│  │  │  │  │  │     ├─ page.js.nft.json
│  │  │  │  │  │     └─ page_client-reference-manifest.js
│  │  │  │  │  ├─ folders
│  │  │  │  │  │  ├─ [category]
│  │  │  │  │  │  │  ├─ page.js
│  │  │  │  │  │  │  ├─ page.js.nft.json
│  │  │  │  │  │  │  └─ page_client-reference-manifest.js
│  │  │  │  │  │  ├─ page.js
│  │  │  │  │  │  ├─ page.js.nft.json
│  │  │  │  │  │  └─ page_client-reference-manifest.js
│  │  │  │  │  ├─ formation-personnel
│  │  │  │  │  │  ├─ page.js
│  │  │  │  │  │  ├─ page.js.nft.json
│  │  │  │  │  │  └─ page_client-reference-manifest.js
│  │  │  │  │  ├─ page
│  │  │  │  │  │  ├─ app-build-manifest.json
│  │  │  │  │  │  ├─ app-paths-manifest.json
│  │  │  │  │  │  ├─ build-manifest.json
│  │  │  │  │  │  ├─ next-font-manifest.json
│  │  │  │  │  │  ├─ react-loadable-manifest.json
│  │  │  │  │  │  └─ server-reference-manifest.json
│  │  │  │  │  ├─ page.js
│  │  │  │  │  ├─ page.js.map
│  │  │  │  │  ├─ page.js.nft.json
│  │  │  │  │  ├─ page_client-reference-manifest.js
│  │  │  │  │  └─ users
│  │  │  │  │     ├─ page.js
│  │  │  │  │     ├─ page.js.nft.json
│  │  │  │  │     └─ page_client-reference-manifest.js
│  │  │  │  ├─ page
│  │  │  │  │  ├─ app-build-manifest.json
│  │  │  │  │  ├─ app-paths-manifest.json
│  │  │  │  │  ├─ build-manifest.json
│  │  │  │  │  ├─ next-font-manifest.json
│  │  │  │  │  ├─ react-loadable-manifest.json
│  │  │  │  │  └─ server-reference-manifest.json
│  │  │  │  ├─ page.js
│  │  │  │  ├─ page.js.map
│  │  │  │  ├─ page.js.nft.json
│  │  │  │  └─ page_client-reference-manifest.js
│  │  │  ├─ dashboard.html
│  │  │  ├─ dashboard.meta
│  │  │  ├─ dashboard.rsc
│  │  │  ├─ favicon.ico
│  │  │  │  ├─ route
│  │  │  │  │  ├─ app-build-manifest.json
│  │  │  │  │  ├─ app-paths-manifest.json
│  │  │  │  │  └─ build-manifest.json
│  │  │  │  ├─ route.js
│  │  │  │  ├─ route.js.map
│  │  │  │  └─ route.js.nft.json
│  │  │  ├─ favicon.ico.body
│  │  │  ├─ favicon.ico.meta
│  │  │  ├─ logout
│  │  │  │  ├─ route.js
│  │  │  │  ├─ route.js.nft.json
│  │  │  │  └─ route_client-reference-manifest.js
│  │  │  ├─ page
│  │  │  │  ├─ app-build-manifest.json
│  │  │  │  ├─ app-paths-manifest.json
│  │  │  │  ├─ build-manifest.json
│  │  │  │  ├─ next-font-manifest.json
│  │  │  │  ├─ react-loadable-manifest.json
│  │  │  │  └─ server-reference-manifest.json
│  │  │  ├─ page.js
│  │  │  ├─ page.js.map
│  │  │  ├─ page.js.nft.json
│  │  │  ├─ page_client-reference-manifest.js
│  │  │  ├─ setup
│  │  │  │  ├─ page.js
│  │  │  │  ├─ page.js.nft.json
│  │  │  │  └─ page_client-reference-manifest.js
│  │  │  ├─ setup.html
│  │  │  ├─ setup.meta
│  │  │  └─ setup.rsc
│  │  ├─ app-paths-manifest.json
│  │  ├─ chunks
│  │  │  ├─ 1384.js
│  │  │  ├─ 1826.js
│  │  │  ├─ 259.js
│  │  │  ├─ 337.js
│  │  │  ├─ 3384.js
│  │  │  ├─ 4088.js
│  │  │  ├─ 4386.js
│  │  │  ├─ 4447.js
│  │  │  ├─ 4999.js
│  │  │  ├─ 5116.js
│  │  │  ├─ 5684.js
│  │  │  ├─ 580.js
│  │  │  ├─ 5970.js
│  │  │  ├─ 6204.js
│  │  │  ├─ 6402.js
│  │  │  ├─ 6447.js
│  │  │  ├─ 7346.js
│  │  │  ├─ 762.js
│  │  │  ├─ 8548.js
│  │  │  ├─ 9567.js
│  │  │  ├─ [root-of-the-server]__15295433._.js
│  │  │  ├─ [root-of-the-server]__15295433._.js.map
│  │  │  ├─ [root-of-the-server]__23ba7e76._.js
│  │  │  ├─ [root-of-the-server]__23ba7e76._.js.map
│  │  │  ├─ [root-of-the-server]__48b32c58._.js
│  │  │  ├─ [root-of-the-server]__48b32c58._.js.map
│  │  │  ├─ [turbopack]_runtime.js
│  │  │  ├─ [turbopack]_runtime.js.map
│  │  │  └─ ssr
│  │  │     ├─ [root-of-the-server]__0259120c._.js
│  │  │     ├─ [root-of-the-server]__0259120c._.js.map
│  │  │     ├─ [root-of-the-server]__0a46983d._.js
│  │  │     ├─ [root-of-the-server]__0a46983d._.js.map
│  │  │     ├─ [root-of-the-server]__107f8d99._.js
│  │  │     ├─ [root-of-the-server]__107f8d99._.js.map
│  │  │     ├─ [root-of-the-server]__12064e91._.js
│  │  │     ├─ [root-of-the-server]__12064e91._.js.map
│  │  │     ├─ [root-of-the-server]__15295433._.js
│  │  │     ├─ [root-of-the-server]__15295433._.js.map
│  │  │     ├─ [root-of-the-server]__1fe67203._.js
│  │  │     ├─ [root-of-the-server]__1fe67203._.js.map
│  │  │     ├─ [root-of-the-server]__2ded9178._.js
│  │  │     ├─ [root-of-the-server]__2ded9178._.js.map
│  │  │     ├─ [root-of-the-server]__33d5fe3a._.js
│  │  │     ├─ [root-of-the-server]__33d5fe3a._.js.map
│  │  │     ├─ [root-of-the-server]__3a6dc879._.js
│  │  │     ├─ [root-of-the-server]__3a6dc879._.js.map
│  │  │     ├─ [root-of-the-server]__426ce70a._.js
│  │  │     ├─ [root-of-the-server]__426ce70a._.js.map
│  │  │     ├─ [root-of-the-server]__4c58c055._.js
│  │  │     ├─ [root-of-the-server]__4c58c055._.js.map
│  │  │     ├─ [root-of-the-server]__50a7c09c._.js
│  │  │     ├─ [root-of-the-server]__50a7c09c._.js.map
│  │  │     ├─ [root-of-the-server]__5420bd10._.js
│  │  │     ├─ [root-of-the-server]__5420bd10._.js.map
│  │  │     ├─ [root-of-the-server]__55aea360._.js
│  │  │     ├─ [root-of-the-server]__55aea360._.js.map
│  │  │     ├─ [root-of-the-server]__55e36aef._.js
│  │  │     ├─ [root-of-the-server]__55e36aef._.js.map
│  │  │     ├─ [root-of-the-server]__6b471877._.js
│  │  │     ├─ [root-of-the-server]__6b471877._.js.map
│  │  │     ├─ [root-of-the-server]__783dede9._.js
│  │  │     ├─ [root-of-the-server]__783dede9._.js.map
│  │  │     ├─ [root-of-the-server]__86e7898f._.js
│  │  │     ├─ [root-of-the-server]__86e7898f._.js.map
│  │  │     ├─ [root-of-the-server]__a25ab650._.js
│  │  │     ├─ [root-of-the-server]__a25ab650._.js.map
│  │  │     ├─ [root-of-the-server]__ae3901e7._.js
│  │  │     ├─ [root-of-the-server]__ae3901e7._.js.map
│  │  │     ├─ [root-of-the-server]__b78590ee._.js
│  │  │     ├─ [root-of-the-server]__b78590ee._.js.map
│  │  │     ├─ [root-of-the-server]__bcc95ae6._.js
│  │  │     ├─ [root-of-the-server]__bcc95ae6._.js.map
│  │  │     ├─ [root-of-the-server]__bec852ac._.js
│  │  │     ├─ [root-of-the-server]__bec852ac._.js.map
│  │  │     ├─ [root-of-the-server]__c75c51b7._.js
│  │  │     ├─ [root-of-the-server]__c75c51b7._.js.map
│  │  │     ├─ [root-of-the-server]__cdb69e42._.js
│  │  │     ├─ [root-of-the-server]__cdb69e42._.js.map
│  │  │     ├─ [root-of-the-server]__e9e68a5a._.js
│  │  │     ├─ [root-of-the-server]__e9e68a5a._.js.map
│  │  │     ├─ [root-of-the-server]__fd84ce72._.js
│  │  │     ├─ [root-of-the-server]__fd84ce72._.js.map
│  │  │     ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_1ab0de75._.js
│  │  │     ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_1ab0de75._.js.map
│  │  │     ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_295d051d._.js
│  │  │     ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_295d051d._.js.map
│  │  │     ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_339998fb._.js
│  │  │     ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_339998fb._.js.map
│  │  │     ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_59fa4ecd._.js
│  │  │     ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_59fa4ecd._.js.map
│  │  │     ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_84bd859f._.js
│  │  │     ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_84bd859f._.js.map
│  │  │     ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_84fb56f8._.js
│  │  │     ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_84fb56f8._.js.map
│  │  │     ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_b0c1e1c6._.js
│  │  │     ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_b0c1e1c6._.js.map
│  │  │     ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_d4301d11._.js
│  │  │     ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_d4301d11._.js.map
│  │  │     ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_f225e179._.js
│  │  │     ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_f225e179._.js.map
│  │  │     ├─ [turbopack]_runtime.js
│  │  │     ├─ [turbopack]_runtime.js.map
│  │  │     ├─ _084090d2._.js
│  │  │     ├─ _084090d2._.js.map
│  │  │     ├─ _1193a02c._.js
│  │  │     ├─ _1193a02c._.js.map
│  │  │     ├─ _18e5dc2b._.js
│  │  │     ├─ _18e5dc2b._.js.map
│  │  │     ├─ _3052178f._.js
│  │  │     ├─ _3052178f._.js.map
│  │  │     ├─ _397ca599._.js
│  │  │     ├─ _397ca599._.js.map
│  │  │     ├─ _5131ed48._.js
│  │  │     ├─ _5131ed48._.js.map
│  │  │     ├─ _58a505c9._.js
│  │  │     ├─ _58a505c9._.js.map
│  │  │     ├─ _5a9acf87._.js
│  │  │     ├─ _5a9acf87._.js.map
│  │  │     ├─ _5f904819._.js
│  │  │     ├─ _5f904819._.js.map
│  │  │     ├─ _863350d5._.js
│  │  │     ├─ _863350d5._.js.map
│  │  │     ├─ _a22ee10c._.js
│  │  │     ├─ _a22ee10c._.js.map
│  │  │     ├─ _c468b8b5._.js
│  │  │     ├─ _c468b8b5._.js.map
│  │  │     ├─ _e0566a73._.js
│  │  │     ├─ _e0566a73._.js.map
│  │  │     ├─ src_10a1a164._.js
│  │  │     ├─ src_10a1a164._.js.map
│  │  │     ├─ src_400c5e33._.js
│  │  │     ├─ src_400c5e33._.js.map
│  │  │     ├─ src_41e4583c._.js
│  │  │     ├─ src_41e4583c._.js.map
│  │  │     ├─ src_4ccd605f._.js
│  │  │     ├─ src_4ccd605f._.js.map
│  │  │     ├─ src_8d3438b3._.js
│  │  │     ├─ src_8d3438b3._.js.map
│  │  │     ├─ src_app_[lang]_dashboard_admin_268b4025._.js
│  │  │     ├─ src_app_[lang]_dashboard_admin_268b4025._.js.map
│  │  │     ├─ src_app_a4430781._.js
│  │  │     ├─ src_app_a4430781._.js.map
│  │  │     ├─ src_f35ce118._.js
│  │  │     ├─ src_f35ce118._.js.map
│  │  │     ├─ src_f9815fdd._.js
│  │  │     └─ src_f9815fdd._.js.map
│  │  ├─ edge
│  │  │  └─ chunks
│  │  │     ├─ [root-of-the-server]__b07e5fa5._.js
│  │  │     ├─ [root-of-the-server]__b07e5fa5._.js.map
│  │  │     ├─ [root-of-the-server]__fa32ba9f._.js
│  │  │     ├─ [root-of-the-server]__fa32ba9f._.js.map
│  │  │     ├─ _05c6c43e._.js
│  │  │     ├─ _05c6c43e._.js.map
│  │  │     ├─ _0d3699dc._.js
│  │  │     ├─ _0d3699dc._.js.map
│  │  │     ├─ edge-wrapper_138988ee.js
│  │  │     ├─ edge-wrapper_138988ee.js.map
│  │  │     ├─ edge-wrapper_9ffd1475.js
│  │  │     ├─ edge-wrapper_9ffd1475.js.map
│  │  │     ├─ edge-wrapper_f5462b5e.js
│  │  │     └─ edge-wrapper_f5462b5e.js.map
│  │  ├─ edge-runtime-webpack.js
│  │  ├─ edge-runtime-webpack.js.map
│  │  ├─ functions-config-manifest.json
│  │  ├─ interception-route-rewrite-manifest.js
│  │  ├─ middleware
│  │  │  └─ middleware-manifest.json
│  │  ├─ middleware-build-manifest.js
│  │  ├─ middleware-manifest.json
│  │  ├─ middleware-react-loadable-manifest.js
│  │  ├─ next-font-manifest.js
│  │  ├─ next-font-manifest.json
│  │  ├─ pages
│  │  │  ├─ 404.html
│  │  │  ├─ 500.html
│  │  │  ├─ _app
│  │  │  │  ├─ build-manifest.json
│  │  │  │  ├─ next-font-manifest.json
│  │  │  │  ├─ pages-manifest.json
│  │  │  │  └─ react-loadable-manifest.json
│  │  │  ├─ _app.js
│  │  │  ├─ _app.js.map
│  │  │  ├─ _app.js.nft.json
│  │  │  ├─ _document
│  │  │  │  ├─ next-font-manifest.json
│  │  │  │  ├─ pages-manifest.json
│  │  │  │  └─ react-loadable-manifest.json
│  │  │  ├─ _document.js
│  │  │  ├─ _document.js.map
│  │  │  ├─ _document.js.nft.json
│  │  │  ├─ _error
│  │  │  │  ├─ build-manifest.json
│  │  │  │  ├─ next-font-manifest.json
│  │  │  │  ├─ pages-manifest.json
│  │  │  │  └─ react-loadable-manifest.json
│  │  │  ├─ _error.js
│  │  │  ├─ _error.js.map
│  │  │  └─ _error.js.nft.json
│  │  ├─ pages-manifest.json
│  │  ├─ server-reference-manifest.js
│  │  ├─ server-reference-manifest.json
│  │  ├─ src
│  │  │  ├─ middleware.js
│  │  │  └─ middleware.js.map
│  │  └─ webpack-runtime.js
│  ├─ static
│  │  ├─ chunks
│  │  │  ├─ 1684-ac9131758364e986.js
│  │  │  ├─ 1850-0090c6206e3520ce.js
│  │  │  ├─ 1898-e9d3806456945911.js
│  │  │  ├─ 294.e72d2554be082393.js
│  │  │  ├─ 3063-81f32a9abd62adb6.js
│  │  │  ├─ 3568-172a13bf684149ca.js
│  │  │  ├─ 4074-5c508fed56bf35a3.js
│  │  │  ├─ 4bd1b696-3d8bf46fdf006764.js
│  │  │  ├─ 6874-39a742459c4768bf.js
│  │  │  ├─ 8067-bd9032696b2d6b39.js
│  │  │  ├─ 8115-ccd35a21a563a6a8.js
│  │  │  ├─ 8211-695ce702c93599ab.js
│  │  │  ├─ 8588-51cb769ca160c95d.js
│  │  │  ├─ 9468-4bf3aa96738361f6.js
│  │  │  ├─ [next]_internal_font_google_geist_e531dabc_module_css_f9ee138c._.single.css
│  │  │  ├─ [next]_internal_font_google_geist_e531dabc_module_css_f9ee138c._.single.css.map
│  │  │  ├─ [next]_internal_font_google_geist_mono_68a01160_module_css_f9ee138c._.single.css
│  │  │  ├─ [next]_internal_font_google_geist_mono_68a01160_module_css_f9ee138c._.single.css.map
│  │  │  ├─ [root-of-the-server]__2c1c44c3._.css
│  │  │  ├─ [root-of-the-server]__2c1c44c3._.css.map
│  │  │  ├─ [root-of-the-server]__49fd8634._.js
│  │  │  ├─ [root-of-the-server]__49fd8634._.js.map
│  │  │  ├─ [root-of-the-server]__527cd323._.js
│  │  │  ├─ [root-of-the-server]__527cd323._.js.map
│  │  │  ├─ [root-of-the-server]__8ebb6d4b._.css
│  │  │  ├─ [root-of-the-server]__8ebb6d4b._.css.map
│  │  │  ├─ [root-of-the-server]__923cb372._.js
│  │  │  ├─ [root-of-the-server]__923cb372._.js.map
│  │  │  ├─ [root-of-the-server]__ec07ee34._.js
│  │  │  ├─ [root-of-the-server]__ec07ee34._.js.map
│  │  │  ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_61dcf9ba._.js
│  │  │  ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_61dcf9ba._.js.map
│  │  │  ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_66796270._.js
│  │  │  ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_fd44f5a4._.js
│  │  │  ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_fd44f5a4._.js.map
│  │  │  ├─ _93808211._.js
│  │  │  ├─ _93808211._.js.map
│  │  │  ├─ _e69f0d32._.js
│  │  │  ├─ app
│  │  │  │  ├─ _not-found
│  │  │  │  │  └─ page-74d5a6babf898609.js
│  │  │  │  ├─ api
│  │  │  │  │  ├─ auth
│  │  │  │  │  │  ├─ signout
│  │  │  │  │  │  │  └─ route-a25c3181320d45cb.js
│  │  │  │  │  │  └─ signup
│  │  │  │  │  │     └─ route-5409292d79a064af.js
│  │  │  │  │  └─ create-admin
│  │  │  │  │     └─ route-3c02b2bee7d77119.js
│  │  │  │  ├─ auth
│  │  │  │  │  ├─ callback
│  │  │  │  │  │  └─ route-61f6c5d443473fec.js
│  │  │  │  │  └─ confirmed
│  │  │  │  │     └─ page-668bcb6f380a6890.js
│  │  │  │  ├─ dashboard
│  │  │  │  │  ├─ admin
│  │  │  │  │  │  ├─ documents
│  │  │  │  │  │  │  └─ new
│  │  │  │  │  │  │     └─ page-b715a06042d719b7.js
│  │  │  │  │  │  ├─ folders
│  │  │  │  │  │  │  ├─ [category]
│  │  │  │  │  │  │  │  └─ page-3ad56f552f1bc2d1.js
│  │  │  │  │  │  │  └─ page-8ae9889b3ba23812.js
│  │  │  │  │  │  ├─ formation-personnel
│  │  │  │  │  │  │  └─ page-abf35cd380474730.js
│  │  │  │  │  │  ├─ layout-238fde54305fd7cc.js
│  │  │  │  │  │  ├─ page-1687b789b1925d87.js
│  │  │  │  │  │  └─ users
│  │  │  │  │  │     └─ page-8491dc7754815ece.js
│  │  │  │  │  ├─ formant
│  │  │  │  │  │  ├─ document
│  │  │  │  │  │  │  └─ new
│  │  │  │  │  │  │     └─ page-bdb4dcfa15f22209.js
│  │  │  │  │  │  ├─ documents
│  │  │  │  │  │  │  └─ new
│  │  │  │  │  │  │     └─ page-32cb3d6d7090d66d.js
│  │  │  │  │  │  ├─ folders
│  │  │  │  │  │  │  ├─ [category]
│  │  │  │  │  │  │  │  └─ page-e92a7e04a857b382.js
│  │  │  │  │  │  │  └─ page-635d5b7b1feb63ac.js
│  │  │  │  │  │  ├─ formation-personnel
│  │  │  │  │  │  │  └─ page-7f0cc1801fe4bd59.js
│  │  │  │  │  │  ├─ layout-64551e9318e32936.js
│  │  │  │  │  │  ├─ page-a3637e2d5e1681d5.js
│  │  │  │  │  │  └─ users
│  │  │  │  │  │     └─ page-6d5810b5a3d7d486.js
│  │  │  │  │  ├─ formee
│  │  │  │  │  │  ├─ documents
│  │  │  │  │  │  │  └─ new
│  │  │  │  │  │  │     └─ page-7be70a12e0f475dc.js
│  │  │  │  │  │  ├─ folders
│  │  │  │  │  │  │  ├─ [category]
│  │  │  │  │  │  │  │  └─ page-b383fe4407dc292d.js
│  │  │  │  │  │  │  └─ page-33deb73f7ee4675f.js
│  │  │  │  │  │  ├─ formation-personnel
│  │  │  │  │  │  │  └─ page-58e2b0afe7a792d9.js
│  │  │  │  │  │  ├─ layout-68a18040920d4830.js
│  │  │  │  │  │  ├─ page-4bbd88ae7c753fa6.js
│  │  │  │  │  │  └─ users
│  │  │  │  │  │     └─ page-4e5888a319606bc8.js
│  │  │  │  │  └─ page-b8c4b7b5fe9d64ff.js
│  │  │  │  ├─ layout-2b137cd1d8601fd8.js
│  │  │  │  ├─ logout
│  │  │  │  │  └─ route-46e29c34368bb342.js
│  │  │  │  ├─ page-5d7ce013beb8c02d.js
│  │  │  │  └─ setup
│  │  │  │     └─ page-54113dfaa2a4424f.js
│  │  │  ├─ f4898fe8-5c11065db494cb53.js
│  │  │  ├─ framework-5bd22f607ebc7826.js
│  │  │  ├─ main-53214ad05025da7e.js
│  │  │  ├─ main-app-b21ad418a24852bf.js
│  │  │  ├─ pages
│  │  │  │  ├─ _app-eb694f3fd49020c8.js
│  │  │  │  ├─ _app.js
│  │  │  │  ├─ _error-2b3482c094a540b4.js
│  │  │  │  └─ _error.js
│  │  │  ├─ pages__app_049595de._.js
│  │  │  ├─ pages__app_049595de._.js.map
│  │  │  ├─ pages__app_5771e187._.js
│  │  │  ├─ pages__error_5771e187._.js
│  │  │  ├─ pages__error_c5ed9705._.js
│  │  │  ├─ pages__error_c5ed9705._.js.map
│  │  │  ├─ polyfills-42372ed130431b0a.js
│  │  │  ├─ src_0d16c7f5._.js
│  │  │  ├─ src_0d16c7f5._.js.map
│  │  │  ├─ src_0e0a8cf9._.js
│  │  │  ├─ src_0e0a8cf9._.js.map
│  │  │  ├─ src_20c38a41._.js
│  │  │  ├─ src_20c38a41._.js.map
│  │  │  ├─ src_2b5a9337._.js
│  │  │  ├─ src_2b5a9337._.js.map
│  │  │  ├─ src_501a0dea._.js
│  │  │  ├─ src_501a0dea._.js.map
│  │  │  ├─ src_53a1705a._.js
│  │  │  ├─ src_53a1705a._.js.map
│  │  │  ├─ src_7500a720._.js
│  │  │  ├─ src_7500a720._.js.map
│  │  │  ├─ src_77d57cb7._.js
│  │  │  ├─ src_77d57cb7._.js.map
│  │  │  ├─ src_app_[lang]_dashboard_admin_layout_tsx_07e76617._.js
│  │  │  ├─ src_app_[lang]_dashboard_admin_layout_tsx_ae9e039b._.js
│  │  │  ├─ src_app_[lang]_dashboard_admin_layout_tsx_d8011c1e._.js
│  │  │  ├─ src_app_[lang]_dashboard_admin_page_tsx_e2a3bd73._.js
│  │  │  ├─ src_app_[lang]_dashboard_admin_users_page_tsx_309902ed._.js
│  │  │  ├─ src_app_[lang]_dashboard_admin_users_page_tsx_b76bf3be._.js
│  │  │  ├─ src_app_[lang]_dashboard_admin_users_page_tsx_e2a3bd73._.js
│  │  │  ├─ src_app_[lang]_globals_css_f9ee138c._.single.css
│  │  │  ├─ src_app_[lang]_globals_css_f9ee138c._.single.css.map
│  │  │  ├─ src_app_[lang]_layout_tsx_c0237562._.js
│  │  │  ├─ src_app_[lang]_page_tsx_07e76617._.js
│  │  │  ├─ src_app_[lang]_page_tsx_ae9e039b._.js
│  │  │  ├─ src_app_[lang]_page_tsx_d8011c1e._.js
│  │  │  ├─ src_app_dashboard_admin_layout_tsx_102c5ba5._.js
│  │  │  ├─ src_app_dashboard_admin_page_tsx_74c7bb7c._.js
│  │  │  ├─ src_app_dashboard_admin_users_page_tsx_74c7bb7c._.js
│  │  │  ├─ src_app_dashboard_formant_folders_page_tsx_e8dfb483._.js
│  │  │  ├─ src_app_dashboard_formant_formation-personnel_page_tsx_e8dfb483._.js
│  │  │  ├─ src_app_dashboard_formant_layout_tsx_102c5ba5._.js
│  │  │  ├─ src_app_dashboard_formant_page_tsx_e8dfb483._.js
│  │  │  ├─ src_app_dashboard_formant_users_page_tsx_e8dfb483._.js
│  │  │  ├─ src_app_dashboard_formee_layout_tsx_102c5ba5._.js
│  │  │  ├─ src_app_dashboard_formee_page_tsx_d9106db2._.js
│  │  │  ├─ src_app_dashboard_page_tsx_102c5ba5._.js
│  │  │  ├─ src_app_favicon_ico_mjs_8a7a8fdc._.js
│  │  │  ├─ src_app_globals_css_f9ee138c._.single.css
│  │  │  ├─ src_app_globals_css_f9ee138c._.single.css.map
│  │  │  ├─ src_app_layout_tsx_c0237562._.js
│  │  │  ├─ src_app_page_tsx_102c5ba5._.js
│  │  │  ├─ src_baf6d2fb._.js
│  │  │  ├─ src_baf6d2fb._.js.map
│  │  │  ├─ src_c1a63fac._.js
│  │  │  ├─ src_c1a63fac._.js.map
│  │  │  ├─ src_ccf9ab29._.js
│  │  │  ├─ src_ccf9ab29._.js.map
│  │  │  ├─ src_components_auth_LoginForm_tsx_c441ede3._.js
│  │  │  ├─ src_components_auth_LoginForm_tsx_c441ede3._.js.map
│  │  │  ├─ src_e7549b89._.js
│  │  │  ├─ src_e7549b89._.js.map
│  │  │  ├─ src_e9a94651._.js
│  │  │  ├─ src_e9a94651._.js.map
│  │  │  ├─ src_ed509892._.js
│  │  │  ├─ src_ed509892._.js.map
│  │  │  ├─ src_f9130980._.js
│  │  │  ├─ src_f9130980._.js.map
│  │  │  └─ webpack-7e54ee0b2fd2f330.js
│  │  ├─ css
│  │  │  └─ 92e83bd70863a705.css
│  │  ├─ development
│  │  │  ├─ _buildManifest.js
│  │  │  ├─ _clientMiddlewareManifest.json
│  │  │  └─ _ssgManifest.js
│  │  ├─ media
│  │  │  ├─ 569ce4b8f30dc480-s.p.woff2
│  │  │  ├─ 747892c23ea88013-s.woff2
│  │  │  ├─ 8d697b304b401681-s.woff2
│  │  │  ├─ 93f479601ee12b01-s.p.woff2
│  │  │  ├─ 9610d9e46709d722-s.woff2
│  │  │  ├─ ba015fad6dcf6784-s.woff2
│  │  │  ├─ favicon.45db1c09.ico
│  │  │  ├─ gyByhwUxId8gMEwSGFWNOITddY4-s.81df3a5b.woff2
│  │  │  ├─ gyByhwUxId8gMEwYGFWNOITddY4-s.b7d310ad.woff2
│  │  │  ├─ gyByhwUxId8gMEwcGFWNOITd-s.p.da1ebef7.woff2
│  │  │  ├─ or3nQ6H_1_WfwkMZI_qYFrMdmhHkjkotbA-s.cb6bbcb1.woff2
│  │  │  ├─ or3nQ6H_1_WfwkMZI_qYFrcdmhHkjko-s.p.be19f591.woff2
│  │  │  └─ or3nQ6H_1_WfwkMZI_qYFrkdmhHkjkotbA-s.e32db976.woff2
│  │  └─ zjOnj84bXirH3kpdn9vMz
│  │     ├─ _buildManifest.js
│  │     └─ _ssgManifest.js
│  ├─ trace
│  ├─ transform.js
│  ├─ transform.js.map
│  └─ types
│     ├─ app
│     │  ├─ api
│     │  │  ├─ auth
│     │  │  │  ├─ signout
│     │  │  │  │  └─ route.ts
│     │  │  │  └─ signup
│     │  │  │     └─ route.ts
│     │  │  └─ create-admin
│     │  │     └─ route.ts
│     │  ├─ auth
│     │  │  ├─ callback
│     │  │  │  └─ route.ts
│     │  │  └─ confirmed
│     │  │     └─ page.ts
│     │  ├─ dashboard
│     │  │  ├─ admin
│     │  │  │  ├─ documents
│     │  │  │  │  └─ new
│     │  │  │  │     └─ page.ts
│     │  │  │  ├─ folders
│     │  │  │  │  ├─ [category]
│     │  │  │  │  │  └─ page.ts
│     │  │  │  │  └─ page.ts
│     │  │  │  ├─ formation-personnel
│     │  │  │  │  └─ page.ts
│     │  │  │  ├─ layout.ts
│     │  │  │  ├─ page.ts
│     │  │  │  └─ users
│     │  │  │     └─ page.ts
│     │  │  ├─ formant
│     │  │  │  ├─ document
│     │  │  │  │  └─ new
│     │  │  │  │     └─ page.ts
│     │  │  │  ├─ documents
│     │  │  │  │  └─ new
│     │  │  │  │     └─ page.ts
│     │  │  │  ├─ folders
│     │  │  │  │  ├─ [category]
│     │  │  │  │  │  └─ page.ts
│     │  │  │  │  └─ page.ts
│     │  │  │  ├─ formation-personnel
│     │  │  │  │  └─ page.ts
│     │  │  │  ├─ layout.ts
│     │  │  │  ├─ page.ts
│     │  │  │  └─ users
│     │  │  │     └─ page.ts
│     │  │  ├─ formee
│     │  │  │  ├─ documents
│     │  │  │  │  └─ new
│     │  │  │  │     └─ page.ts
│     │  │  │  ├─ folders
│     │  │  │  │  ├─ [category]
│     │  │  │  │  │  └─ page.ts
│     │  │  │  │  └─ page.ts
│     │  │  │  ├─ formation-personnel
│     │  │  │  │  └─ page.ts
│     │  │  │  ├─ layout.ts
│     │  │  │  ├─ page.ts
│     │  │  │  └─ users
│     │  │  │     └─ page.ts
│     │  │  └─ page.ts
│     │  ├─ layout.ts
│     │  ├─ logout
│     │  │  └─ route.ts
│     │  ├─ page.ts
│     │  └─ setup
│     │     └─ page.ts
│     ├─ cache-life.d.ts
│     └─ package.json
├─ README.md
├─ eslint.config.mjs
├─ next.config.mjs
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ public
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ logo.png
│  ├─ next.svg
│  ├─ oblate-logo.svg
│  ├─ vercel.svg
│  └─ window.svg
├─ schema_dump.sql
├─ src
│  ├─ app
│  │  └─ [locale]
│  │     ├─ api
│  │     │  ├─ auth
│  │     │  │  ├─ signout
│  │     │  │  │  └─ route.ts
│  │     │  │  └─ signup
│  │     │  │     └─ route.ts
│  │     │  └─ create-admin
│  │     │     └─ route.ts
│  │     ├─ auth
│  │     │  ├─ callback
│  │     │  │  └─ route.ts
│  │     │  └─ confirmed
│  │     │     └─ page.tsx
│  │     ├─ dashboard
│  │     │  ├─ admin
│  │     │  │  ├─ DashboardClient.tsx
│  │     │  │  ├─ documents
│  │     │  │  │  └─ new
│  │     │  │  │     └─ page.tsx
│  │     │  │  ├─ folders
│  │     │  │  │  ├─ [category]
│  │     │  │  │  │  └─ page.tsx
│  │     │  │  │  └─ page.tsx
│  │     │  │  ├─ formation-personnel
│  │     │  │  │  └─ page.tsx
│  │     │  │  ├─ layout.tsx
│  │     │  │  ├─ metadata.tsx
│  │     │  │  ├─ page.tsx
│  │     │  │  └─ users
│  │     │  │     └─ page.tsx
│  │     │  ├─ documents
│  │     │  ├─ formant
│  │     │  │  ├─ DashboardClient.tsx
│  │     │  │  ├─ document
│  │     │  │  │  └─ new
│  │     │  │  │     └─ page.tsx
│  │     │  │  ├─ documents
│  │     │  │  │  └─ new
│  │     │  │  │     └─ page.tsx
│  │     │  │  ├─ folders
│  │     │  │  │  ├─ [category]
│  │     │  │  │  │  └─ page.tsx
│  │     │  │  │  └─ page.tsx
│  │     │  │  ├─ formation-personnel
│  │     │  │  │  └─ page.tsx
│  │     │  │  ├─ layout.tsx
│  │     │  │  ├─ metadata.tsx
│  │     │  │  ├─ page.tsx
│  │     │  │  └─ users
│  │     │  │     └─ page.tsx
│  │     │  ├─ formee
│  │     │  │  ├─ DashboardClient.tsx
│  │     │  │  ├─ documents
│  │     │  │  │  └─ new
│  │     │  │  │     └─ page.tsx
│  │     │  │  ├─ folders
│  │     │  │  │  ├─ [category]
│  │     │  │  │  │  └─ page.tsx
│  │     │  │  │  └─ page.tsx
│  │     │  │  ├─ formation-personnel
│  │     │  │  │  └─ page.tsx
│  │     │  │  ├─ layout.tsx
│  │     │  │  ├─ metadata.tsx
│  │     │  │  ├─ page.tsx
│  │     │  │  └─ users
│  │     │  │     └─ page.tsx
│  │     │  └─ page.tsx
│  │     ├─ favicon.ico
│  │     ├─ formation-personnel
│  │     ├─ globals.css
│  │     ├─ layout.tsx
│  │     ├─ logout
│  │     │  └─ route.ts
│  │     ├─ page.tsx
│  │     └─ setup
│  │        └─ page.tsx
│  ├─ components
│  │  ├─ admin
│  │  │  ├─ AdminAdvancedFilters.tsx
│  │  │  ├─ DocumentCard.tsx
│  │  │  ├─ DocumentList.tsx
│  │  │  ├─ DocumentRow.tsx
│  │  │  ├─ DocumentsFilters.tsx
│  │  │  ├─ DocumentsList.tsx
│  │  │  ├─ Header.tsx
│  │  │  ├─ PaginationControls.tsx
│  │  │  ├─ Sidebar.tsx
│  │  │  ├─ SortableHeader.tsx
│  │  │  ├─ documents
│  │  │  │  ├─ CheckboxField.tsx
│  │  │  │  ├─ DatalistField.tsx
│  │  │  │  ├─ FileDropzone.tsx
│  │  │  │  ├─ FormField.tsx
│  │  │  │  ├─ MultiSelectButtons.tsx
│  │  │  │  ├─ SelectField.tsx
│  │  │  │  ├─ UploadForm.tsx
│  │  │  │  └─ UploadProgress.tsx
│  │  │  └─ users
│  │  │     ├─ AddUserForm.tsx
│  │  │     ├─ AddUserModal.tsx
│  │  │     ├─ FormatorUserTable.tsx
│  │  │     ├─ FormeeUserTable.tsx
│  │  │     └─ UserManagementClient.tsx
│  │  ├─ auth
│  │  │  └─ LoginForm.tsx
│  │  ├─ formant
│  │  │  ├─ AdminAdvancedFilters.tsx
│  │  │  ├─ DocumentCard.tsx
│  │  │  ├─ DocumentList.tsx
│  │  │  ├─ DocumentRow.tsx
│  │  │  ├─ DocumentsFilters.tsx
│  │  │  ├─ DocumentsList.tsx
│  │  │  ├─ Header.tsx
│  │  │  ├─ PaginationControls.tsx
│  │  │  ├─ SortableHeader.tsx
│  │  │  ├─ documents
│  │  │  │  ├─ CheckboxField.tsx
│  │  │  │  ├─ DatalistField.tsx
│  │  │  │  ├─ FileDropzone.tsx
│  │  │  │  ├─ FormField.tsx
│  │  │  │  ├─ MultiSelectButtons.tsx
│  │  │  │  ├─ SelectField.tsx
│  │  │  │  ├─ UploadForm.tsx
│  │  │  │  └─ UploadProgress.tsx
│  │  │  └─ users
│  │  │     ├─ AddUserForm.tsx
│  │  │     ├─ AddUserModal.tsx
│  │  │     ├─ FormatorUserTable.tsx
│  │  │     ├─ FormeeUserTable.tsx
│  │  │     └─ UserManagementClient.tsx
│  │  ├─ formation
│  │  │  └─ MemberCard.tsx
│  │  ├─ formee
│  │  │  ├─ AdminAdvancedFilters.tsx
│  │  │  ├─ DocumentCard.tsx
│  │  │  ├─ DocumentList.tsx
│  │  │  ├─ DocumentRow.tsx
│  │  │  ├─ DocumentsFilters.tsx
│  │  │  ├─ DocumentsList.tsx
│  │  │  ├─ Header.tsx
│  │  │  ├─ PaginationControls.tsx
│  │  │  ├─ SortableHeader.tsx
│  │  │  ├─ documents
│  │  │  │  ├─ CheckboxField.tsx
│  │  │  │  ├─ DatalistField.tsx
│  │  │  │  ├─ FileDropzone.tsx
│  │  │  │  ├─ FormField.tsx
│  │  │  │  ├─ MultiSelectButtons.tsx
│  │  │  │  ├─ SelectField.tsx
│  │  │  │  ├─ UploadForm.tsx
│  │  │  │  └─ UploadProgress.tsx
│  │  │  └─ users
│  │  │     ├─ AddUserForm.tsx
│  │  │     ├─ AddUserModal.tsx
│  │  │     ├─ FormatorUserTable.tsx
│  │  │     ├─ FormeeUserTable.tsx
│  │  │     └─ UserManagementClient.tsx
│  │  ├─ shared
│  │  │  ├─ AdvancedFilters.tsx
│  │  │  ├─ DocumentsFilters.tsx
│  │  │  ├─ FilterMultiSelect.tsx
│  │  │  ├─ FolderComponent.tsx
│  │  │  ├─ PaginationControls.tsx
│  │  │  └─ SimpleDocumentCard.tsx
│  │  └─ ui
│  │     ├─ AuthForm.tsx
│  │     ├─ Avatar.tsx
│  │     ├─ Button.tsx
│  │     ├─ FileIcon.tsx
│  │     ├─ Input.tsx
│  │     ├─ Modal.tsx
│  │     └─ UserAvatar.tsx
│  ├─ contexts
│  │  └─ AuthContext.tsx
│  ├─ hooks
│  │  └─ useDocumentUpload.ts
│  ├─ i18n
│  │  ├─ navigation.ts
│  │  ├─ request.ts
│  │  └─ routing.ts
│  ├─ i18n.ts
│  ├─ lib
│  │  ├─ auth
│  │  ├─ supabase
│  │  │  ├─ admin.ts
│  │  │  ├─ browser-client.ts
│  │  │  ├─ middleware-client.ts
│  │  │  └─ server-client.ts
│  │  ├─ utils
│  │  │  ├─ auth-routes.ts
│  │  │  ├─ routes.ts
│  │  │  └─ urls.ts
│  │  ├─ utils.ts
│  │  └─ wordpress
│  │     ├─ api.ts
│  │     └─ types.ts
│  ├─ locales
│  │  ├─ en.json
│  │  └─ fr.json
│  ├─ middleware.ts
│  ├─ services
│  └─ types
│     ├─ document.ts
│     └─ supabase.ts
├─ supabase
│  ├─ .branches
│  │  └─ _current_branch
│  ├─ .temp
│  │  ├─ cli-latest
│  │  ├─ gotrue-version
│  │  ├─ pooler-url
│  │  ├─ postgres-version
│  │  ├─ project-ref
│  │  ├─ rest-version
│  │  └─ storage-version
│  ├─ config.toml
│  ├─ functions
│  ├─ migrations
│  │  ├─ 20250430100825_init.sql
│  │  ├─ 20250430110000_add_role_to_profiles.sql
│  │  ├─ 20250430110001_fix_user_role_enum.sql
│  │  ├─ 20250430120000_create_admin_user.sql
│  │  ├─ 20250430120001_fix_infinite_recursion.sql
│  │  ├─ 20250430130000_fix_admin_user.sql
│  │  ├─ 20250430140000_fix_null_fields_in_admin_user.sql
│  │  ├─ 20250430212801_create_get_category_counts_function.sql
│  │  ├─ 20250430231210_update_user_roles_v2.sql
│  │  ├─ 20250501000000_fix_email_change_field.sql
│  │  ├─ 20250501010000_fix_email_change_token_new.sql
│  │  ├─ 20250502000000_update_handle_new_user.sql
│  │  ├─ 20250502000729_update_handle_new_user_v2.sql
│  │  ├─ 20250502002032_add_admin_select_profiles_policy.sql
│  │  ├─ 20250502002252_create_is_admin_func_and_update_policy.sql
│  │  ├─ 20250502011951_fix_documents_admin_rls.sql
│  │  ├─ 20250510000000_add_documents_table.sql
│  │  ├─ 20250516153000_add_documents_storage_policies.sql
│  │  ├─ 20250516164500_add_documents_insert_policy.sql
│  │  └─ 20250516170000_allow_authenticated_storage_read.sql
│  └─ supabase
│     ├─ .temp
│     │  └─ cli-latest
│     └─ config.toml
├─ tailwind.config.mjs
└─ tsconfig.json

```
```
osfs-formation
├─ .cursor
│  └─ rules
│     ├─ database-functions.mdc
│     ├─ migrations-supabase.mdc
│     ├─ postgresql-style.mdc
│     ├─ rls-policies.mdc
│     └─ supabase-edge-function.mdc
├─ .cursorrules
├─ .husky
│  ├─ _
│  │  ├─ applypatch-msg
│  │  ├─ commit-msg
│  │  ├─ h
│  │  ├─ husky.sh
│  │  ├─ post-applypatch
│  │  ├─ post-checkout
│  │  ├─ post-commit
│  │  ├─ post-merge
│  │  ├─ post-rewrite
│  │  ├─ pre-applypatch
│  │  ├─ pre-auto-gc
│  │  ├─ pre-commit
│  │  ├─ pre-merge-commit
│  │  ├─ pre-push
│  │  ├─ pre-rebase
│  │  └─ prepare-commit-msg
│  └─ pre-commit
├─ .next
│  ├─ BUILD_ID
│  ├─ app-build-manifest.json
│  ├─ app-path-routes-manifest.json
│  ├─ build
│  │  └─ chunks
│  │     ├─ [root-of-the-server]__04d7a048._.js
│  │     ├─ [root-of-the-server]__04d7a048._.js.map
│  │     ├─ [root-of-the-server]__05f88b00._.js
│  │     ├─ [root-of-the-server]__05f88b00._.js.map
│  │     ├─ [turbopack]_runtime.js
│  │     ├─ [turbopack]_runtime.js.map
│  │     ├─ postcss_config_mjs_transform_ts_f0ffbaad._.js
│  │     └─ postcss_config_mjs_transform_ts_f0ffbaad._.js.map
│  ├─ build-manifest.json
│  ├─ cache
│  │  ├─ .rscinfo
│  │  ├─ eslint
│  │  │  └─ .cache_t3k93v
│  │  ├─ fetch-cache
│  │  │  ├─ 04d58910134a9d219827b4573dd3110569aa332c730b3c6e5d5b94fe823edf9a
│  │  │  ├─ 09897803dca1272eb5b72c7def540ff03ca6ccafea89f1b3b24e59c6dcd4f191
│  │  │  ├─ 2216c5aa123b6d45edda98d0d27b97d1e16ecd0ce49c84a3b96f3e0528b2f438
│  │  │  ├─ 2cc4ec78043a56a93cb501c63038445ef15c1472c8dbe7201c5862244057b0c5
│  │  │  ├─ 2f7c4a9354c118536925227935063c7146b51931c9ee6782067bf28f2190d3fe
│  │  │  ├─ 2f801117e77b25dc772651fbc67ccab212e427fb5b011c5bfba3337903d627ae
│  │  │  ├─ 4e54431dcf5caadc6512ecb226cf87b8ba3af57fb84a64ed2ef9de10bdc5e795
│  │  │  ├─ 6cff6195de522664fe4d30ae184812929d3c00f93575def51663b5f6ffcf4d24
│  │  │  ├─ 71b1defc47583546b19863e084e532cedb806b0319b7626a72dea97bb777d83e
│  │  │  ├─ 7f68de837ffdecfd7cf590f663e68b1ad415472d36f89ac0b1519aec9af90e2d
│  │  │  ├─ ad40466b343d7f9cdd7946c3f3a0dc8f5810aa4672d082ee389e02bc43b2f388
│  │  │  ├─ b42b33e50411f36e27815240e3534cd3bda57b1d89ace03582eb0f1691aafae2
│  │  │  ├─ b8e1d8761d6305e74b25a662f423477fcb7b20af944808c997e939a921222534
│  │  │  ├─ bfd76e3a803e0a50e307e9207d5133c0a17b610ca7d7010abb68e6e8d32e9ca8
│  │  │  ├─ cf7dbad9c9469c01b10749a76bc3180978e3ae2ef796407c045b2d57da97e78c
│  │  │  ├─ e400149c3608c15538f0e1a4880b1b442ab86a9e3e50bd032ea8be339884c4ee
│  │  │  └─ ee01d4cf37d331a938a081d255c30bcac5750140c589edb61379a7616deea8dd
│  │  ├─ images
│  │  │  ├─ -V59vBzNatipPeESMe-syx8q2WjNGmGrfWmmIyztv-8
│  │  │  │  └─ 31536000.1778011428862.0DPzO_KR-Xn2k9RTKn91ZHbqiM3D1Cfw26-Mloc1MqY.IjY3YmE2MjI5LTRhNzci.webp
│  │  │  ├─ 1bRTjuJvIq71JeHxruNk4IkX5qo4YMdxL6JAsHsK_hY
│  │  │  │  └─ 31536000.1778022909803.SatbCl0lHS8Yht5Impf1jh6IbEsblLhVTyy0FKZ36Iw.IjY3YmE2MjI4LTI2OWMi.webp
│  │  │  ├─ 1uADZb3rNpBb01sGLbBZlJZYXuzeSDv4V3IjsnNqq_4
│  │  │  │  └─ 31536000.1778011430132.L1UeqjzO6xaLGNbQG8zWPpQPeDFn1VLPRNEhLEAlVUA.IjY3YmE2MjI5LTI3Nzki.webp
│  │  │  ├─ 3mtpgsg-6Ij4W_XM4YFBds5fkM_YQPegRdkkKJK-8vo
│  │  │  │  └─ 31536000.1778022909874.nKSz6jOXnjVDmy_Yjem0XVxrAU4TiMvdQ2g9efdSLPY.IjY3YmE2MjI5LTZlZTYi.webp
│  │  │  ├─ 8k47rRtmrOarjJqz3Iluvx6q1HTAlhKuGsPP7jvxlFc
│  │  │  │  └─ 31536000.1778022909810.j8l9uVxfNDDlDrWoJykaJG1sAGPdTcJJC4buYFNXV5g.IjY3YmE2MjJhLTQ4ZjEi.webp
│  │  │  ├─ BPhKWb-pT-yPP8uxnNcoZdkG03jwxHV9yoex005GQmU
│  │  │  │  └─ 31536000.1778022909762.d2dOnYUCvL3b73BUOagZsVOd-vWCUuk0lf40Sdk1x3g.IjY3YmE2MjI5LTQyYTAi.webp
│  │  │  ├─ CGFhlI9PByVvGP1Hbr4zRZyjN1dEJ6HnG6dWRcC6hVU
│  │  │  │  └─ 31536000.1778022909763.LrwmGXEqwQSar7wiecI-picFH44KenkCLjtNRLxRRfw.IjY3YmE2MjJhLTQ1YjUi.webp
│  │  │  ├─ CJShXvhBryaZIqPwhYv6auKS8LtXTSSS3EREc3fFIXE
│  │  │  │  └─ 31536000.1778022909806.ctIK4bWEYDD2dbuVJgHsbxyRddIK8818djX8-5T-Fs8.IjY3YmE2MjJhLTQ2YWIi.webp
│  │  │  ├─ ECsbMSoAHn9Bx5kgmjQMAo0s7UWT3H8lIwkL0lHq8GY
│  │  │  │  └─ 31536000.1778022909803.URlVCOwv11YDHGCI6AIdogVy0wIKQe4M5uvaxu1FF3o.IjY3YmE2MjJhLTMyZWUi.webp
│  │  │  ├─ HXsNogeHhGk9RSGH6nER81PP79Yacdx4_SHmY2F11Og
│  │  │  │  └─ 31536000.1778022909763.imq7bnpkvgRhLv9MTYWWZufplwoTYqdUmy587EqqGu4.IjY3YmE2MjJhLTY0NDEi.webp
│  │  │  ├─ LLQJ-OH_oM5krsXz_sQQ5_pDiO3xoC-9mcLVds4aPqI
│  │  │  │  └─ 31536000.1778011428785.ZFCyPoc3b62VTjXc6ESY4aFzTWZS7Tm5SC3RIXzpYgI.IjY3YmE2MjJhLTQ1YjUi.webp
│  │  │  ├─ MnZq4nReXcQGbcvIDurrJCOEPjRqqji_qW9KCeas1qg
│  │  │  │  └─ 31536000.1778011428860.lYAjqNIrRUtYPTMB4Vwo1cPKLBmQ1YBIOCziIUCO3Bs.IjY3YmE2MjJhLTQ2YWIi.webp
│  │  │  ├─ OseFwiYooSvfSRl5MYvJFSVQAZMtGO1l2VF-TgGAnpI
│  │  │  │  └─ 31536000.1778011428836.2I9HfMyvPtJW_ytCsXbyEqc3VtVTc6ePuw8RJ2w-Zo8.IjY3YmE2MjJhLTMyZWUi.webp
│  │  │  ├─ Q6uZTa8s8axX6en39HwAsAuZM-3Q7rv4tPQXFUGu6RY
│  │  │  │  └─ 31536000.1778011428776.WTdcyJWbm89bsXFRtAjJPTpUgBJ3YYr1CiDU4caFIvA.IjY3YmE2MjJhLTQ4ZjEi.webp
│  │  │  ├─ QR62w9vZdCVwGv7pWbOeDoMla0EpDnlgdjuLOA3YWP0
│  │  │  │  └─ 31536000.1778011428835.060XvpJfAmGPiOdkd-oHGeKvGkMgNMN83pKcsjNQMuo.IjY3YmE2MjI4LTI2OWMi.webp
│  │  │  ├─ YmX76mwx28FzQeMAb--o_tUBZfceDpycE1uPR3xVE0I
│  │  │  │  └─ 31536000.1778011428778.aUji3jwsw6eGbk7RALU6-qszHv8vxAtvVQamx_xEjSk.IjY3YmE2MjJhLTY0NDEi.webp
│  │  │  ├─ _3E3tbr0GmeA9q-dlLWb9iLkV00Ym_bPWyYah2xGRY8
│  │  │  │  └─ 31536000.1778011430171.6R-7Vr9Q90_Iw1fBR0HF8SgIVeOBFApgZnfZY3_x4o4.IjY3YmE2MjI4LWEwMjAi.webp
│  │  │  ├─ fkax4TiMRrOu0DvIBVArMArRGJbwKBSBxk4cckYa_q0
│  │  │  │  └─ 31536000.1778022909873.KWIoD5me6pbeWD9ALtAO29dthTMmA-DAbELtiYdKJzc.IjY3YmE2MjI5LTRhNzci.webp
│  │  │  ├─ lPZiwflXBMIgko96Yj6iMPYPM5z84jCFx40aPacXDds
│  │  │  │  └─ 31536000.1778022909764.Zc8vUmqjymkC-3vivqEaTsJ6PLZOmZJmYPI_b0YxG4A.IjY3YmE2MjJhLTdkZTAi.webp
│  │  │  ├─ mTT4d4mdGqiNq5IChtCu9JebTKr5WFwO8rQWxGV7q8E
│  │  │  │  └─ 31536000.1778011428908.bu8aOwjhIlhYJV5ELXdXBU4IhG5dYFoWHQDej9CqznY.IjY3YmE2MjI5LTZlZTYi.webp
│  │  │  ├─ pgH88ipRXD7tlusXZ6iygPVBUps15ulWhxSyYh8MGfw
│  │  │  │  └─ 31536000.1778011428780.0ocHDXV6aWU82N01YmH6SXV2OqJ2jprPKFLzqC30GVU.IjY3YmE2MjJhLTdkZTAi.webp
│  │  │  ├─ q0aYGTTzU20nIdEOX5f8oDnmhPNbhrn45mfxJZLAh10
│  │  │  │  └─ 31536000.1778011428827.lZ77DQbJQmB7_2m7Gi_fSbQdXLrV4ER_hz2SKEHYcxU.IjY3YmE2MjI5LTE4ODIi.webp
│  │  │  ├─ tLkbhv4E_RR0ElI3oJV2HQuP3pqlICmSKAsEP0F5vgw
│  │  │  │  └─ 31536000.1778022909795.6gRo13NZRtGhORzdrUQF1CPbTo1DALCNHObGg89FLcA.IjY3YmE2MjI5LTE4ODIi.webp
│  │  │  └─ uK8k79y9lUJRBUD_tSPklPF0qkbCbgtmpjOI3-5fV9E
│  │  │     └─ 31536000.1778011428775.DXPvw0b71WkqNtDRw3RoZlUYNx5Jbjtax9ZPKsEnv7Y.IjY3YmE2MjI5LTQyYTAi.webp
│  │  ├─ swc
│  │  │  └─ plugins
│  │  │     └─ v7_macos_aarch64_9.0.0
│  │  └─ webpack
│  │     ├─ client-production
│  │     │  ├─ 0.pack
│  │     │  ├─ 1.pack
│  │     │  ├─ 10.pack
│  │     │  ├─ 11.pack
│  │     │  ├─ 12.pack
│  │     │  ├─ 13.pack
│  │     │  ├─ 14.pack
│  │     │  ├─ 15.pack
│  │     │  ├─ 16.pack
│  │     │  ├─ 17.pack
│  │     │  ├─ 18.pack
│  │     │  ├─ 2.pack
│  │     │  ├─ 3.pack
│  │     │  ├─ 4.pack
│  │     │  ├─ 5.pack
│  │     │  ├─ 6.pack
│  │     │  ├─ 7.pack
│  │     │  ├─ 8.pack
│  │     │  ├─ 9.pack
│  │     │  ├─ index.pack
│  │     │  └─ index.pack.old
│  │     ├─ edge-server-production
│  │     │  ├─ 0.pack
│  │     │  ├─ 1.pack
│  │     │  ├─ 2.pack
│  │     │  ├─ index.pack
│  │     │  └─ index.pack.old
│  │     └─ server-production
│  │        ├─ 0.pack
│  │        ├─ 1.pack
│  │        ├─ 2.pack
│  │        ├─ 3.pack
│  │        ├─ 4.pack
│  │        ├─ 5.pack
│  │        ├─ 6.pack
│  │        ├─ 7.pack
│  │        ├─ 8.pack
│  │        ├─ 9.pack
│  │        ├─ index.pack
│  │        └─ index.pack.old
│  ├─ diagnostics
│  │  ├─ build-diagnostics.json
│  │  └─ framework.json
│  ├─ export-marker.json
│  ├─ fallback-build-manifest.json
│  ├─ images-manifest.json
│  ├─ next-minimal-server.js.nft.json
│  ├─ next-server.js.nft.json
│  ├─ package.json
│  ├─ prerender-manifest.json
│  ├─ react-loadable-manifest.json
│  ├─ required-server-files.json
│  ├─ routes-manifest.json
│  ├─ server
│  │  ├─ app
│  │  │  ├─ [locale]
│  │  │  │  ├─ api
│  │  │  │  │  ├─ auth
│  │  │  │  │  │  ├─ signout
│  │  │  │  │  │  │  ├─ route.js
│  │  │  │  │  │  │  ├─ route.js.nft.json
│  │  │  │  │  │  │  └─ route_client-reference-manifest.js
│  │  │  │  │  │  └─ signup
│  │  │  │  │  │     ├─ route.js
│  │  │  │  │  │     ├─ route.js.nft.json
│  │  │  │  │  │     └─ route_client-reference-manifest.js
│  │  │  │  │  ├─ create-admin
│  │  │  │  │  │  ├─ route.js
│  │  │  │  │  │  ├─ route.js.nft.json
│  │  │  │  │  │  └─ route_client-reference-manifest.js
│  │  │  │  │  ├─ delete-pending-user
│  │  │  │  │  │  ├─ route.js
│  │  │  │  │  │  ├─ route.js.nft.json
│  │  │  │  │  │  └─ route_client-reference-manifest.js
│  │  │  │  │  ├─ send-approval-email
│  │  │  │  │  │  ├─ route.js
│  │  │  │  │  │  ├─ route.js.nft.json
│  │  │  │  │  │  └─ route_client-reference-manifest.js
│  │  │  │  │  └─ send-document-email
│  │  │  │  │     ├─ route.js
│  │  │  │  │     ├─ route.js.nft.json
│  │  │  │  │     └─ route_client-reference-manifest.js
│  │  │  │  ├─ auth
│  │  │  │  │  ├─ callback
│  │  │  │  │  │  ├─ route.js
│  │  │  │  │  │  ├─ route.js.nft.json
│  │  │  │  │  │  └─ route_client-reference-manifest.js
│  │  │  │  │  ├─ confirmation
│  │  │  │  │  │  ├─ page.js
│  │  │  │  │  │  ├─ page.js.nft.json
│  │  │  │  │  │  └─ page_client-reference-manifest.js
│  │  │  │  │  └─ confirmed
│  │  │  │  │     ├─ page.js
│  │  │  │  │     ├─ page.js.nft.json
│  │  │  │  │     └─ page_client-reference-manifest.js
│  │  │  │  ├─ dashboard
│  │  │  │  │  ├─ admin
│  │  │  │  │  │  ├─ admin
│  │  │  │  │  │  │  ├─ page.js
│  │  │  │  │  │  │  ├─ page.js.nft.json
│  │  │  │  │  │  │  └─ page_client-reference-manifest.js
│  │  │  │  │  │  ├─ documents
│  │  │  │  │  │  │  ├─ new
│  │  │  │  │  │  │  │  ├─ page.js
│  │  │  │  │  │  │  │  ├─ page.js.nft.json
│  │  │  │  │  │  │  │  └─ page_client-reference-manifest.js
│  │  │  │  │  │  │  └─ syllabus
│  │  │  │  │  │  │     ├─ page.js
│  │  │  │  │  │  │     ├─ page.js.nft.json
│  │  │  │  │  │  │     └─ page_client-reference-manifest.js
│  │  │  │  │  │  ├─ email
│  │  │  │  │  │  │  ├─ page
│  │  │  │  │  │  │  │  ├─ app-build-manifest.json
│  │  │  │  │  │  │  │  ├─ app-paths-manifest.json
│  │  │  │  │  │  │  │  ├─ build-manifest.json
│  │  │  │  │  │  │  │  ├─ next-font-manifest.json
│  │  │  │  │  │  │  │  ├─ react-loadable-manifest.json
│  │  │  │  │  │  │  │  └─ server-reference-manifest.json
│  │  │  │  │  │  │  ├─ page.js
│  │  │  │  │  │  │  ├─ page.js.map
│  │  │  │  │  │  │  ├─ page.js.nft.json
│  │  │  │  │  │  │  └─ page_client-reference-manifest.js
│  │  │  │  │  │  ├─ folders
│  │  │  │  │  │  │  ├─ [category]
│  │  │  │  │  │  │  │  ├─ page
│  │  │  │  │  │  │  │  │  ├─ app-build-manifest.json
│  │  │  │  │  │  │  │  │  ├─ app-paths-manifest.json
│  │  │  │  │  │  │  │  │  ├─ build-manifest.json
│  │  │  │  │  │  │  │  │  ├─ next-font-manifest.json
│  │  │  │  │  │  │  │  │  ├─ react-loadable-manifest.json
│  │  │  │  │  │  │  │  │  └─ server-reference-manifest.json
│  │  │  │  │  │  │  │  ├─ page.js
│  │  │  │  │  │  │  │  ├─ page.js.map
│  │  │  │  │  │  │  │  ├─ page.js.nft.json
│  │  │  │  │  │  │  │  └─ page_client-reference-manifest.js
│  │  │  │  │  │  │  ├─ page
│  │  │  │  │  │  │  │  ├─ app-build-manifest.json
│  │  │  │  │  │  │  │  ├─ app-paths-manifest.json
│  │  │  │  │  │  │  │  ├─ build-manifest.json
│  │  │  │  │  │  │  │  ├─ next-font-manifest.json
│  │  │  │  │  │  │  │  ├─ react-loadable-manifest.json
│  │  │  │  │  │  │  │  └─ server-reference-manifest.json
│  │  │  │  │  │  │  ├─ page.js
│  │  │  │  │  │  │  ├─ page.js.map
│  │  │  │  │  │  │  ├─ page.js.nft.json
│  │  │  │  │  │  │  └─ page_client-reference-manifest.js
│  │  │  │  │  │  ├─ formation-personnel
│  │  │  │  │  │  │  ├─ page
│  │  │  │  │  │  │  │  ├─ app-build-manifest.json
│  │  │  │  │  │  │  │  ├─ app-paths-manifest.json
│  │  │  │  │  │  │  │  ├─ build-manifest.json
│  │  │  │  │  │  │  │  ├─ next-font-manifest.json
│  │  │  │  │  │  │  │  ├─ react-loadable-manifest.json
│  │  │  │  │  │  │  │  └─ server-reference-manifest.json
│  │  │  │  │  │  │  ├─ page.js
│  │  │  │  │  │  │  ├─ page.js.map
│  │  │  │  │  │  │  ├─ page.js.nft.json
│  │  │  │  │  │  │  └─ page_client-reference-manifest.js
│  │  │  │  │  │  ├─ page
│  │  │  │  │  │  │  ├─ app-build-manifest.json
│  │  │  │  │  │  │  ├─ app-paths-manifest.json
│  │  │  │  │  │  │  ├─ build-manifest.json
│  │  │  │  │  │  │  ├─ next-font-manifest.json
│  │  │  │  │  │  │  ├─ react-loadable-manifest.json
│  │  │  │  │  │  │  └─ server-reference-manifest.json
│  │  │  │  │  │  ├─ page.js
│  │  │  │  │  │  ├─ page.js.map
│  │  │  │  │  │  ├─ page.js.nft.json
│  │  │  │  │  │  ├─ page_client-reference-manifest.js
│  │  │  │  │  │  ├─ pending-users
│  │  │  │  │  │  │  ├─ page.js
│  │  │  │  │  │  │  ├─ page.js.nft.json
│  │  │  │  │  │  │  └─ page_client-reference-manifest.js
│  │  │  │  │  │  ├─ users
│  │  │  │  │  │  │  ├─ page.js
│  │  │  │  │  │  │  ├─ page.js.nft.json
│  │  │  │  │  │  │  └─ page_client-reference-manifest.js
│  │  │  │  │  │  └─ workshops
│  │  │  │  │  │     ├─ [workshop]
│  │  │  │  │  │     │  ├─ [...folder]
│  │  │  │  │  │     │  │  ├─ page
│  │  │  │  │  │     │  │  │  ├─ app-build-manifest.json
│  │  │  │  │  │     │  │  │  ├─ app-paths-manifest.json
│  │  │  │  │  │     │  │  │  ├─ build-manifest.json
│  │  │  │  │  │     │  │  │  ├─ next-font-manifest.json
│  │  │  │  │  │     │  │  │  ├─ react-loadable-manifest.json
│  │  │  │  │  │     │  │  │  └─ server-reference-manifest.json
│  │  │  │  │  │     │  │  ├─ page.js
│  │  │  │  │  │     │  │  ├─ page.js.map
│  │  │  │  │  │     │  │  └─ page_client-reference-manifest.js
│  │  │  │  │  │     │  ├─ page
│  │  │  │  │  │     │  │  ├─ app-build-manifest.json
│  │  │  │  │  │     │  │  ├─ app-paths-manifest.json
│  │  │  │  │  │     │  │  ├─ build-manifest.json
│  │  │  │  │  │     │  │  ├─ next-font-manifest.json
│  │  │  │  │  │     │  │  ├─ react-loadable-manifest.json
│  │  │  │  │  │     │  │  └─ server-reference-manifest.json
│  │  │  │  │  │     │  ├─ page.js
│  │  │  │  │  │     │  ├─ page.js.map
│  │  │  │  │  │     │  └─ page_client-reference-manifest.js
│  │  │  │  │  │     ├─ page
│  │  │  │  │  │     │  ├─ app-build-manifest.json
│  │  │  │  │  │     │  ├─ app-paths-manifest.json
│  │  │  │  │  │     │  ├─ build-manifest.json
│  │  │  │  │  │     │  ├─ next-font-manifest.json
│  │  │  │  │  │     │  ├─ react-loadable-manifest.json
│  │  │  │  │  │     │  └─ server-reference-manifest.json
│  │  │  │  │  │     ├─ page.js
│  │  │  │  │  │     ├─ page.js.map
│  │  │  │  │  │     ├─ page_client-reference-manifest.js
│  │  │  │  │  │     └─ upload
│  │  │  │  │  │        ├─ page
│  │  │  │  │  │        │  ├─ app-build-manifest.json
│  │  │  │  │  │        │  ├─ app-paths-manifest.json
│  │  │  │  │  │        │  ├─ build-manifest.json
│  │  │  │  │  │        │  ├─ next-font-manifest.json
│  │  │  │  │  │        │  ├─ react-loadable-manifest.json
│  │  │  │  │  │        │  └─ server-reference-manifest.json
│  │  │  │  │  │        ├─ page.js
│  │  │  │  │  │        ├─ page.js.map
│  │  │  │  │  │        └─ page_client-reference-manifest.js
│  │  │  │  │  ├─ editor
│  │  │  │  │  │  ├─ page
│  │  │  │  │  │  │  ├─ app-build-manifest.json
│  │  │  │  │  │  │  ├─ app-paths-manifest.json
│  │  │  │  │  │  │  ├─ build-manifest.json
│  │  │  │  │  │  │  ├─ next-font-manifest.json
│  │  │  │  │  │  │  ├─ react-loadable-manifest.json
│  │  │  │  │  │  │  └─ server-reference-manifest.json
│  │  │  │  │  │  ├─ page.js
│  │  │  │  │  │  ├─ page.js.map
│  │  │  │  │  │  └─ page_client-reference-manifest.js
│  │  │  │  │  ├─ formant
│  │  │  │  │  │  ├─ document
│  │  │  │  │  │  │  └─ new
│  │  │  │  │  │  │     ├─ page.js
│  │  │  │  │  │  │     ├─ page.js.nft.json
│  │  │  │  │  │  │     └─ page_client-reference-manifest.js
│  │  │  │  │  │  ├─ documents
│  │  │  │  │  │  │  └─ new
│  │  │  │  │  │  │     ├─ page.js
│  │  │  │  │  │  │     ├─ page.js.nft.json
│  │  │  │  │  │  │     └─ page_client-reference-manifest.js
│  │  │  │  │  │  ├─ folders
│  │  │  │  │  │  │  ├─ [category]
│  │  │  │  │  │  │  │  ├─ page.js
│  │  │  │  │  │  │  │  ├─ page.js.nft.json
│  │  │  │  │  │  │  │  └─ page_client-reference-manifest.js
│  │  │  │  │  │  │  ├─ page
│  │  │  │  │  │  │  │  ├─ app-build-manifest.json
│  │  │  │  │  │  │  │  ├─ app-paths-manifest.json
│  │  │  │  │  │  │  │  ├─ build-manifest.json
│  │  │  │  │  │  │  │  ├─ next-font-manifest.json
│  │  │  │  │  │  │  │  ├─ react-loadable-manifest.json
│  │  │  │  │  │  │  │  └─ server-reference-manifest.json
│  │  │  │  │  │  │  ├─ page.js
│  │  │  │  │  │  │  ├─ page.js.map
│  │  │  │  │  │  │  ├─ page.js.nft.json
│  │  │  │  │  │  │  └─ page_client-reference-manifest.js
│  │  │  │  │  │  ├─ formation-personnel
│  │  │  │  │  │  │  ├─ page.js
│  │  │  │  │  │  │  ├─ page.js.nft.json
│  │  │  │  │  │  │  └─ page_client-reference-manifest.js
│  │  │  │  │  │  ├─ page
│  │  │  │  │  │  │  ├─ app-build-manifest.json
│  │  │  │  │  │  │  ├─ app-paths-manifest.json
│  │  │  │  │  │  │  ├─ build-manifest.json
│  │  │  │  │  │  │  ├─ next-font-manifest.json
│  │  │  │  │  │  │  ├─ react-loadable-manifest.json
│  │  │  │  │  │  │  └─ server-reference-manifest.json
│  │  │  │  │  │  ├─ page.js
│  │  │  │  │  │  ├─ page.js.map
│  │  │  │  │  │  ├─ page.js.nft.json
│  │  │  │  │  │  ├─ page_client-reference-manifest.js
│  │  │  │  │  │  ├─ users
│  │  │  │  │  │  │  ├─ page
│  │  │  │  │  │  │  │  ├─ app-build-manifest.json
│  │  │  │  │  │  │  │  ├─ app-paths-manifest.json
│  │  │  │  │  │  │  │  ├─ build-manifest.json
│  │  │  │  │  │  │  │  ├─ next-font-manifest.json
│  │  │  │  │  │  │  │  ├─ react-loadable-manifest.json
│  │  │  │  │  │  │  │  └─ server-reference-manifest.json
│  │  │  │  │  │  │  ├─ page.js
│  │  │  │  │  │  │  ├─ page.js.map
│  │  │  │  │  │  │  ├─ page.js.nft.json
│  │  │  │  │  │  │  └─ page_client-reference-manifest.js
│  │  │  │  │  │  └─ workshops
│  │  │  │  │  │     ├─ [workshop]
│  │  │  │  │  │     │  ├─ [...folder]
│  │  │  │  │  │     │  │  ├─ page
│  │  │  │  │  │     │  │  │  ├─ app-build-manifest.json
│  │  │  │  │  │     │  │  │  ├─ app-paths-manifest.json
│  │  │  │  │  │     │  │  │  ├─ build-manifest.json
│  │  │  │  │  │     │  │  │  ├─ next-font-manifest.json
│  │  │  │  │  │     │  │  │  ├─ react-loadable-manifest.json
│  │  │  │  │  │     │  │  │  └─ server-reference-manifest.json
│  │  │  │  │  │     │  │  ├─ page.js
│  │  │  │  │  │     │  │  ├─ page.js.map
│  │  │  │  │  │     │  │  └─ page_client-reference-manifest.js
│  │  │  │  │  │     │  ├─ page
│  │  │  │  │  │     │  │  ├─ app-build-manifest.json
│  │  │  │  │  │     │  │  ├─ app-paths-manifest.json
│  │  │  │  │  │     │  │  ├─ build-manifest.json
│  │  │  │  │  │     │  │  ├─ next-font-manifest.json
│  │  │  │  │  │     │  │  ├─ react-loadable-manifest.json
│  │  │  │  │  │     │  │  └─ server-reference-manifest.json
│  │  │  │  │  │     │  ├─ page.js
│  │  │  │  │  │     │  ├─ page.js.map
│  │  │  │  │  │     │  └─ page_client-reference-manifest.js
│  │  │  │  │  │     ├─ page
│  │  │  │  │  │     │  ├─ app-build-manifest.json
│  │  │  │  │  │     │  ├─ app-paths-manifest.json
│  │  │  │  │  │     │  ├─ build-manifest.json
│  │  │  │  │  │     │  ├─ next-font-manifest.json
│  │  │  │  │  │     │  ├─ react-loadable-manifest.json
│  │  │  │  │  │     │  └─ server-reference-manifest.json
│  │  │  │  │  │     ├─ page.js
│  │  │  │  │  │     ├─ page.js.map
│  │  │  │  │  │     └─ page_client-reference-manifest.js
│  │  │  │  │  ├─ formee
│  │  │  │  │  │  ├─ documents
│  │  │  │  │  │  │  └─ new
│  │  │  │  │  │  │     ├─ page.js
│  │  │  │  │  │  │     ├─ page.js.nft.json
│  │  │  │  │  │  │     └─ page_client-reference-manifest.js
│  │  │  │  │  │  ├─ folders
│  │  │  │  │  │  │  ├─ [category]
│  │  │  │  │  │  │  │  ├─ page.js
│  │  │  │  │  │  │  │  ├─ page.js.nft.json
│  │  │  │  │  │  │  │  └─ page_client-reference-manifest.js
│  │  │  │  │  │  │  ├─ page
│  │  │  │  │  │  │  │  ├─ app-build-manifest.json
│  │  │  │  │  │  │  │  ├─ app-paths-manifest.json
│  │  │  │  │  │  │  │  ├─ build-manifest.json
│  │  │  │  │  │  │  │  ├─ next-font-manifest.json
│  │  │  │  │  │  │  │  ├─ react-loadable-manifest.json
│  │  │  │  │  │  │  │  └─ server-reference-manifest.json
│  │  │  │  │  │  │  ├─ page.js
│  │  │  │  │  │  │  ├─ page.js.map
│  │  │  │  │  │  │  ├─ page.js.nft.json
│  │  │  │  │  │  │  └─ page_client-reference-manifest.js
│  │  │  │  │  │  ├─ formation-personnel
│  │  │  │  │  │  │  ├─ page.js
│  │  │  │  │  │  │  ├─ page.js.nft.json
│  │  │  │  │  │  │  └─ page_client-reference-manifest.js
│  │  │  │  │  │  ├─ page
│  │  │  │  │  │  │  ├─ app-build-manifest.json
│  │  │  │  │  │  │  ├─ app-paths-manifest.json
│  │  │  │  │  │  │  ├─ build-manifest.json
│  │  │  │  │  │  │  ├─ next-font-manifest.json
│  │  │  │  │  │  │  ├─ react-loadable-manifest.json
│  │  │  │  │  │  │  └─ server-reference-manifest.json
│  │  │  │  │  │  ├─ page.js
│  │  │  │  │  │  ├─ page.js.map
│  │  │  │  │  │  ├─ page.js.nft.json
│  │  │  │  │  │  ├─ page_client-reference-manifest.js
│  │  │  │  │  │  ├─ users
│  │  │  │  │  │  │  ├─ page.js
│  │  │  │  │  │  │  ├─ page.js.nft.json
│  │  │  │  │  │  │  └─ page_client-reference-manifest.js
│  │  │  │  │  │  └─ workshops
│  │  │  │  │  │     ├─ [workshop]
│  │  │  │  │  │     │  ├─ [...folder]
│  │  │  │  │  │     │  │  ├─ page
│  │  │  │  │  │     │  │  │  ├─ app-build-manifest.json
│  │  │  │  │  │     │  │  │  ├─ app-paths-manifest.json
│  │  │  │  │  │     │  │  │  ├─ build-manifest.json
│  │  │  │  │  │     │  │  │  ├─ next-font-manifest.json
│  │  │  │  │  │     │  │  │  ├─ react-loadable-manifest.json
│  │  │  │  │  │     │  │  │  └─ server-reference-manifest.json
│  │  │  │  │  │     │  │  ├─ page.js
│  │  │  │  │  │     │  │  ├─ page.js.map
│  │  │  │  │  │     │  │  └─ page_client-reference-manifest.js
│  │  │  │  │  │     │  ├─ page
│  │  │  │  │  │     │  │  ├─ app-build-manifest.json
│  │  │  │  │  │     │  │  ├─ app-paths-manifest.json
│  │  │  │  │  │     │  │  ├─ build-manifest.json
│  │  │  │  │  │     │  │  ├─ next-font-manifest.json
│  │  │  │  │  │     │  │  ├─ react-loadable-manifest.json
│  │  │  │  │  │     │  │  └─ server-reference-manifest.json
│  │  │  │  │  │     │  ├─ page.js
│  │  │  │  │  │     │  ├─ page.js.map
│  │  │  │  │  │     │  └─ page_client-reference-manifest.js
│  │  │  │  │  │     ├─ page
│  │  │  │  │  │     │  ├─ app-build-manifest.json
│  │  │  │  │  │     │  ├─ app-paths-manifest.json
│  │  │  │  │  │     │  ├─ build-manifest.json
│  │  │  │  │  │     │  ├─ next-font-manifest.json
│  │  │  │  │  │     │  ├─ react-loadable-manifest.json
│  │  │  │  │  │     │  └─ server-reference-manifest.json
│  │  │  │  │  │     ├─ page.js
│  │  │  │  │  │     ├─ page.js.map
│  │  │  │  │  │     └─ page_client-reference-manifest.js
│  │  │  │  │  ├─ page
│  │  │  │  │  │  ├─ app-build-manifest.json
│  │  │  │  │  │  ├─ app-paths-manifest.json
│  │  │  │  │  │  ├─ build-manifest.json
│  │  │  │  │  │  ├─ next-font-manifest.json
│  │  │  │  │  │  ├─ react-loadable-manifest.json
│  │  │  │  │  │  └─ server-reference-manifest.json
│  │  │  │  │  ├─ page.js
│  │  │  │  │  ├─ page.js.map
│  │  │  │  │  ├─ page.js.nft.json
│  │  │  │  │  └─ page_client-reference-manifest.js
│  │  │  │  ├─ logout
│  │  │  │  │  ├─ route
│  │  │  │  │  │  ├─ app-build-manifest.json
│  │  │  │  │  │  ├─ app-paths-manifest.json
│  │  │  │  │  │  ├─ build-manifest.json
│  │  │  │  │  │  ├─ next-font-manifest.json
│  │  │  │  │  │  ├─ react-loadable-manifest.json
│  │  │  │  │  │  └─ server-reference-manifest.json
│  │  │  │  │  ├─ route.js
│  │  │  │  │  ├─ route.js.map
│  │  │  │  │  ├─ route.js.nft.json
│  │  │  │  │  └─ route_client-reference-manifest.js
│  │  │  │  ├─ page
│  │  │  │  │  ├─ app-build-manifest.json
│  │  │  │  │  ├─ app-paths-manifest.json
│  │  │  │  │  ├─ build-manifest.json
│  │  │  │  │  ├─ next-font-manifest.json
│  │  │  │  │  ├─ react-loadable-manifest.json
│  │  │  │  │  └─ server-reference-manifest.json
│  │  │  │  ├─ page.js
│  │  │  │  ├─ page.js.map
│  │  │  │  ├─ page.js.nft.json
│  │  │  │  ├─ page_client-reference-manifest.js
│  │  │  │  ├─ setup
│  │  │  │  │  ├─ page.js
│  │  │  │  │  ├─ page.js.nft.json
│  │  │  │  │  └─ page_client-reference-manifest.js
│  │  │  │  └─ signup
│  │  │  │     ├─ page.js
│  │  │  │     ├─ page.js.nft.json
│  │  │  │     └─ page_client-reference-manifest.js
│  │  │  ├─ _not-found
│  │  │  │  ├─ page
│  │  │  │  │  ├─ app-build-manifest.json
│  │  │  │  │  ├─ app-paths-manifest.json
│  │  │  │  │  ├─ build-manifest.json
│  │  │  │  │  ├─ next-font-manifest.json
│  │  │  │  │  ├─ react-loadable-manifest.json
│  │  │  │  │  └─ server-reference-manifest.json
│  │  │  │  ├─ page.js
│  │  │  │  ├─ page.js.map
│  │  │  │  ├─ page.js.nft.json
│  │  │  │  └─ page_client-reference-manifest.js
│  │  │  ├─ _not-found.html
│  │  │  ├─ _not-found.meta
│  │  │  ├─ _not-found.rsc
│  │  │  ├─ api
│  │  │  │  ├─ delete-pending-user
│  │  │  │  │  ├─ route.js
│  │  │  │  │  ├─ route.js.nft.json
│  │  │  │  │  └─ route_client-reference-manifest.js
│  │  │  │  └─ send-approval-email
│  │  │  │     ├─ route.js
│  │  │  │     ├─ route.js.nft.json
│  │  │  │     └─ route_client-reference-manifest.js
│  │  │  ├─ en
│  │  │  │  ├─ auth
│  │  │  │  └─ dashboard
│  │  │  │     ├─ admin
│  │  │  │     │  └─ documents
│  │  │  │     ├─ formant
│  │  │  │     │  ├─ document
│  │  │  │     │  └─ documents
│  │  │  │     └─ formee
│  │  │  │        └─ documents
│  │  │  └─ fr
│  │  │     ├─ auth
│  │  │     └─ dashboard
│  │  │        ├─ admin
│  │  │        │  └─ documents
│  │  │        ├─ formant
│  │  │        │  ├─ document
│  │  │        │  └─ documents
│  │  │        └─ formee
│  │  │           └─ documents
│  │  ├─ app-paths-manifest.json
│  │  ├─ chunks
│  │  │  ├─ 1981.js
│  │  │  ├─ 2163.js
│  │  │  ├─ 230.js
│  │  │  ├─ 2355.js
│  │  │  ├─ 2629.js
│  │  │  ├─ 3061.js
│  │  │  ├─ 3112.js
│  │  │  ├─ 3384.js
│  │  │  ├─ 3624.js
│  │  │  ├─ 3646.js
│  │  │  ├─ 4386.js
│  │  │  ├─ 4408.js
│  │  │  ├─ 4447.js
│  │  │  ├─ 4825.js
│  │  │  ├─ 4999.js
│  │  │  ├─ 5116.js
│  │  │  ├─ 580.js
│  │  │  ├─ 5879.js
│  │  │  ├─ 6402.js
│  │  │  ├─ 6533.js
│  │  │  ├─ 6690.js
│  │  │  ├─ 6970.js
│  │  │  ├─ 7221.js
│  │  │  ├─ 7346.js
│  │  │  ├─ 762.js
│  │  │  ├─ 839.js
│  │  │  ├─ 8548.js
│  │  │  ├─ 9229.js
│  │  │  ├─ 9525.js
│  │  │  ├─ 9960.js
│  │  │  ├─ [root-of-the-server]__15295433._.js
│  │  │  ├─ [root-of-the-server]__15295433._.js.map
│  │  │  ├─ [root-of-the-server]__9b5ea48b._.js
│  │  │  ├─ [root-of-the-server]__9b5ea48b._.js.map
│  │  │  ├─ [turbopack]_runtime.js
│  │  │  ├─ [turbopack]_runtime.js.map
│  │  │  └─ ssr
│  │  │     ├─ [root-of-the-server]__0a46983d._.js
│  │  │     ├─ [root-of-the-server]__0a46983d._.js.map
│  │  │     ├─ [root-of-the-server]__1033ada8._.js
│  │  │     ├─ [root-of-the-server]__1033ada8._.js.map
│  │  │     ├─ [root-of-the-server]__15295433._.js
│  │  │     ├─ [root-of-the-server]__15295433._.js.map
│  │  │     ├─ [root-of-the-server]__3c66accb._.js
│  │  │     ├─ [root-of-the-server]__3c66accb._.js.map
│  │  │     ├─ [root-of-the-server]__44cdd46a._.js
│  │  │     ├─ [root-of-the-server]__44cdd46a._.js.map
│  │  │     ├─ [root-of-the-server]__50a7c09c._.js
│  │  │     ├─ [root-of-the-server]__50a7c09c._.js.map
│  │  │     ├─ [root-of-the-server]__55e2bc91._.js
│  │  │     ├─ [root-of-the-server]__55e2bc91._.js.map
│  │  │     ├─ [root-of-the-server]__63454377._.js
│  │  │     ├─ [root-of-the-server]__63454377._.js.map
│  │  │     ├─ [root-of-the-server]__7ef48f3c._.js
│  │  │     ├─ [root-of-the-server]__7ef48f3c._.js.map
│  │  │     ├─ [root-of-the-server]__82afaf85._.js
│  │  │     ├─ [root-of-the-server]__82afaf85._.js.map
│  │  │     ├─ [root-of-the-server]__86e7898f._.js
│  │  │     ├─ [root-of-the-server]__86e7898f._.js.map
│  │  │     ├─ [root-of-the-server]__941cd132._.js
│  │  │     ├─ [root-of-the-server]__941cd132._.js.map
│  │  │     ├─ [root-of-the-server]__b3b64e29._.js
│  │  │     ├─ [root-of-the-server]__b3b64e29._.js.map
│  │  │     ├─ [root-of-the-server]__b78590ee._.js
│  │  │     ├─ [root-of-the-server]__b78590ee._.js.map
│  │  │     ├─ [root-of-the-server]__c75c51b7._.js
│  │  │     ├─ [root-of-the-server]__c75c51b7._.js.map
│  │  │     ├─ [root-of-the-server]__cdb69e42._.js
│  │  │     ├─ [root-of-the-server]__cdb69e42._.js.map
│  │  │     ├─ [root-of-the-server]__ddf5ccc0._.js
│  │  │     ├─ [root-of-the-server]__ddf5ccc0._.js.map
│  │  │     ├─ [root-of-the-server]__de872f14._.js
│  │  │     ├─ [root-of-the-server]__de872f14._.js.map
│  │  │     ├─ [root-of-the-server]__fc907c7d._.js
│  │  │     ├─ [root-of-the-server]__fc907c7d._.js.map
│  │  │     ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_370e3dda._.js
│  │  │     ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_370e3dda._.js.map
│  │  │     ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_4c7ebdcb._.js
│  │  │     ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_4c7ebdcb._.js.map
│  │  │     ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_59fa4ecd._.js
│  │  │     ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_59fa4ecd._.js.map
│  │  │     ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_8b3553ba._.js
│  │  │     ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_8b3553ba._.js.map
│  │  │     ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_aaf0fd56._.js
│  │  │     ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_aaf0fd56._.js.map
│  │  │     ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_c27b933a._.js
│  │  │     ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_c27b933a._.js.map
│  │  │     ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_d4301d11._.js
│  │  │     ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_d4301d11._.js.map
│  │  │     ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_f4ce68a7._.js
│  │  │     ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_f4ce68a7._.js.map
│  │  │     ├─ [turbopack]_runtime.js
│  │  │     ├─ [turbopack]_runtime.js.map
│  │  │     ├─ _05f08393._.js
│  │  │     ├─ _05f08393._.js.map
│  │  │     ├─ _070dea64._.js
│  │  │     ├─ _070dea64._.js.map
│  │  │     ├─ _162b4884._.js
│  │  │     ├─ _162b4884._.js.map
│  │  │     ├─ _1699021e._.js
│  │  │     ├─ _1699021e._.js.map
│  │  │     ├─ _232c6d24._.js
│  │  │     ├─ _232c6d24._.js.map
│  │  │     ├─ _26f2438c._.js
│  │  │     ├─ _26f2438c._.js.map
│  │  │     ├─ _2a5f6795._.js
│  │  │     ├─ _2a5f6795._.js.map
│  │  │     ├─ _2f483082._.js
│  │  │     ├─ _2f483082._.js.map
│  │  │     ├─ _3a4962aa._.js
│  │  │     ├─ _3a4962aa._.js.map
│  │  │     ├─ _4734f707._.js
│  │  │     ├─ _4734f707._.js.map
│  │  │     ├─ _5131ed48._.js
│  │  │     ├─ _5131ed48._.js.map
│  │  │     ├─ _64f7511b._.js
│  │  │     ├─ _64f7511b._.js.map
│  │  │     ├─ _6a815074._.js
│  │  │     ├─ _6a815074._.js.map
│  │  │     ├─ _77421123._.js
│  │  │     ├─ _77421123._.js.map
│  │  │     ├─ _7a29ec4c._.js
│  │  │     ├─ _7a29ec4c._.js.map
│  │  │     ├─ _7bc11cdd._.js
│  │  │     ├─ _7bc11cdd._.js.map
│  │  │     ├─ _7d9692bc._.js
│  │  │     ├─ _7d9692bc._.js.map
│  │  │     ├─ _8a95ffc5._.js
│  │  │     ├─ _8a95ffc5._.js.map
│  │  │     ├─ _91987a3f._.js
│  │  │     ├─ _91987a3f._.js.map
│  │  │     ├─ _987c70d8._.js
│  │  │     ├─ _987c70d8._.js.map
│  │  │     ├─ _a344a0e9._.js
│  │  │     ├─ _a344a0e9._.js.map
│  │  │     ├─ _ae8760d2._.js
│  │  │     ├─ _ae8760d2._.js.map
│  │  │     ├─ _c2c92b66._.js
│  │  │     ├─ _c2c92b66._.js.map
│  │  │     ├─ _c6be3a6a._.js
│  │  │     ├─ _c6be3a6a._.js.map
│  │  │     ├─ _cc0d9b4f._.js
│  │  │     ├─ _cc0d9b4f._.js.map
│  │  │     ├─ _cc23f317._.js
│  │  │     ├─ _cc23f317._.js.map
│  │  │     ├─ _dc479662._.js
│  │  │     ├─ _dc479662._.js.map
│  │  │     ├─ _e4fb8799._.js
│  │  │     ├─ _e4fb8799._.js.map
│  │  │     ├─ _e7336537._.js
│  │  │     ├─ _e7336537._.js.map
│  │  │     ├─ _edb15e6b._.js
│  │  │     ├─ _edb15e6b._.js.map
│  │  │     ├─ _f5da8eca._.js
│  │  │     ├─ _f5da8eca._.js.map
│  │  │     ├─ src_0c8ce69d._.js
│  │  │     ├─ src_0c8ce69d._.js.map
│  │  │     ├─ src_20ac3c1a._.js
│  │  │     ├─ src_20ac3c1a._.js.map
│  │  │     ├─ src_234652b7._.js
│  │  │     ├─ src_234652b7._.js.map
│  │  │     ├─ src_31adbd24._.js
│  │  │     ├─ src_31adbd24._.js.map
│  │  │     ├─ src_33e6fe71._.js
│  │  │     ├─ src_33e6fe71._.js.map
│  │  │     ├─ src_400c5e33._.js
│  │  │     ├─ src_400c5e33._.js.map
│  │  │     ├─ src_443b6399._.js
│  │  │     ├─ src_443b6399._.js.map
│  │  │     ├─ src_47184216._.js
│  │  │     ├─ src_47184216._.js.map
│  │  │     ├─ src_49e398ce._.js
│  │  │     ├─ src_49e398ce._.js.map
│  │  │     ├─ src_515b411f._.js
│  │  │     ├─ src_515b411f._.js.map
│  │  │     ├─ src_55d783d5._.js
│  │  │     ├─ src_55d783d5._.js.map
│  │  │     ├─ src_5f55ff28._.js
│  │  │     ├─ src_5f55ff28._.js.map
│  │  │     ├─ src_84398321._.js
│  │  │     ├─ src_84398321._.js.map
│  │  │     ├─ src_931a14e9._.js
│  │  │     ├─ src_931a14e9._.js.map
│  │  │     ├─ src_a1bd9438._.js
│  │  │     ├─ src_a1bd9438._.js.map
│  │  │     ├─ src_ab87069c._.js
│  │  │     ├─ src_ab87069c._.js.map
│  │  │     ├─ src_ae696a7d._.js
│  │  │     ├─ src_ae696a7d._.js.map
│  │  │     ├─ src_app_[locale]_dashboard_admin_bc282407._.js
│  │  │     ├─ src_app_[locale]_dashboard_admin_bc282407._.js.map
│  │  │     ├─ src_app_[locale]_dashboard_editor_b9410cf6._.js
│  │  │     ├─ src_app_[locale]_dashboard_editor_b9410cf6._.js.map
│  │  │     ├─ src_app_[locale]_dashboard_formant_585e12f4._.js
│  │  │     ├─ src_app_[locale]_dashboard_formant_585e12f4._.js.map
│  │  │     ├─ src_app_[locale]_dashboard_formee_2fa21f38._.js
│  │  │     ├─ src_app_[locale]_dashboard_formee_2fa21f38._.js.map
│  │  │     ├─ src_b166e6d0._.js
│  │  │     ├─ src_b166e6d0._.js.map
│  │  │     ├─ src_b5bc753e._.js
│  │  │     ├─ src_b5bc753e._.js.map
│  │  │     ├─ src_b7ca0692._.js
│  │  │     ├─ src_b7ca0692._.js.map
│  │  │     ├─ src_b9958eb7._.js
│  │  │     ├─ src_b9958eb7._.js.map
│  │  │     ├─ src_cd08f697._.js
│  │  │     ├─ src_cd08f697._.js.map
│  │  │     ├─ src_components_6c6cca3b._.js
│  │  │     ├─ src_components_6c6cca3b._.js.map
│  │  │     ├─ src_d3a0e0b7._.js
│  │  │     ├─ src_d3a0e0b7._.js.map
│  │  │     ├─ src_d8ac44f8._.js
│  │  │     ├─ src_d8ac44f8._.js.map
│  │  │     ├─ src_f9365f39._.js
│  │  │     ├─ src_f9365f39._.js.map
│  │  │     ├─ src_locales_5ab44f70._.js
│  │  │     ├─ src_locales_5ab44f70._.js.map
│  │  │     ├─ src_locales_de_json_297ebdca._.js
│  │  │     ├─ src_locales_de_json_297ebdca._.js.map
│  │  │     ├─ src_locales_en_json_31442742._.js
│  │  │     ├─ src_locales_en_json_31442742._.js.map
│  │  │     ├─ src_locales_es_json_dc579319._.js
│  │  │     ├─ src_locales_es_json_dc579319._.js.map
│  │  │     ├─ src_locales_fr_json_29b82a82._.js
│  │  │     ├─ src_locales_fr_json_29b82a82._.js.map
│  │  │     ├─ src_locales_it_json_0ce66437._.js
│  │  │     ├─ src_locales_it_json_0ce66437._.js.map
│  │  │     ├─ src_locales_nl_json_df7d463e._.js
│  │  │     ├─ src_locales_nl_json_df7d463e._.js.map
│  │  │     ├─ src_locales_pt_json_377051d6._.js
│  │  │     └─ src_locales_pt_json_377051d6._.js.map
│  │  ├─ edge
│  │  │  └─ chunks
│  │  │     ├─ [root-of-the-server]__b07e5fa5._.js
│  │  │     ├─ [root-of-the-server]__b07e5fa5._.js.map
│  │  │     ├─ _0d3699dc._.js
│  │  │     ├─ _0d3699dc._.js.map
│  │  │     ├─ edge-wrapper_9ffd1475.js
│  │  │     └─ edge-wrapper_9ffd1475.js.map
│  │  ├─ edge-runtime-webpack.js
│  │  ├─ edge-runtime-webpack.js.map
│  │  ├─ functions-config-manifest.json
│  │  ├─ interception-route-rewrite-manifest.js
│  │  ├─ middleware
│  │  │  └─ middleware-manifest.json
│  │  ├─ middleware-build-manifest.js
│  │  ├─ middleware-manifest.json
│  │  ├─ middleware-react-loadable-manifest.js
│  │  ├─ next-font-manifest.js
│  │  ├─ next-font-manifest.json
│  │  ├─ pages
│  │  │  ├─ 404.html
│  │  │  ├─ 500.html
│  │  │  ├─ _app
│  │  │  │  ├─ build-manifest.json
│  │  │  │  ├─ next-font-manifest.json
│  │  │  │  ├─ pages-manifest.json
│  │  │  │  └─ react-loadable-manifest.json
│  │  │  ├─ _app.js
│  │  │  ├─ _app.js.map
│  │  │  ├─ _app.js.nft.json
│  │  │  ├─ _document
│  │  │  │  ├─ next-font-manifest.json
│  │  │  │  ├─ pages-manifest.json
│  │  │  │  └─ react-loadable-manifest.json
│  │  │  ├─ _document.js
│  │  │  ├─ _document.js.map
│  │  │  ├─ _document.js.nft.json
│  │  │  ├─ _error
│  │  │  │  ├─ build-manifest.json
│  │  │  │  ├─ next-font-manifest.json
│  │  │  │  ├─ pages-manifest.json
│  │  │  │  └─ react-loadable-manifest.json
│  │  │  ├─ _error.js
│  │  │  ├─ _error.js.map
│  │  │  └─ _error.js.nft.json
│  │  ├─ pages-manifest.json
│  │  ├─ server-reference-manifest.js
│  │  ├─ server-reference-manifest.json
│  │  ├─ src
│  │  │  ├─ middleware.js
│  │  │  └─ middleware.js.map
│  │  └─ webpack-runtime.js
│  ├─ static
│  │  ├─ chunks
│  │  │  ├─ 1684-ac9131758364e986.js
│  │  │  ├─ 1850-0090c6206e3520ce.js
│  │  │  ├─ 1898-c6768eb431b54793.js
│  │  │  ├─ 1ab64_app_[locale]_dashboard_admin_workshops_[workshop]_[___folder]_page_tsx_d1a8d4d2._.js
│  │  │  ├─ 294.e72d2554be082393.js
│  │  │  ├─ 3063-81f32a9abd62adb6.js
│  │  │  ├─ 3226-4b4581d529a8c0e0.js
│  │  │  ├─ 3385-8cc062844c5c04e6.js
│  │  │  ├─ 3568-172a13bf684149ca.js
│  │  │  ├─ 4377-87647bd8fdb865d5.js
│  │  │  ├─ 44-5fd8a94c0e554d8f.js
│  │  │  ├─ 4bd1b696-3d8bf46fdf006764.js
│  │  │  ├─ 6600-003494e4875c037f.js
│  │  │  ├─ 6874-39a742459c4768bf.js
│  │  │  ├─ 7505-1ea6e27b8e0517dd.js
│  │  │  ├─ 8115-7360bb1cdc49f039.js
│  │  │  ├─ 8212-dd920b444bcfb6e9.js
│  │  │  ├─ 8487-367b8f53d5cba1dc.js
│  │  │  ├─ 8588-f240281f28da8b2e.js
│  │  │  ├─ 970-93b7983cbe78a3c8.js
│  │  │  ├─ [next]_internal_font_google_geist_e531dabc_module_css_f9ee138c._.single.css
│  │  │  ├─ [next]_internal_font_google_geist_e531dabc_module_css_f9ee138c._.single.css.map
│  │  │  ├─ [next]_internal_font_google_geist_mono_68a01160_module_css_f9ee138c._.single.css
│  │  │  ├─ [next]_internal_font_google_geist_mono_68a01160_module_css_f9ee138c._.single.css.map
│  │  │  ├─ [root-of-the-server]__25638e8a._.css
│  │  │  ├─ [root-of-the-server]__25638e8a._.css.map
│  │  │  ├─ [root-of-the-server]__49fd8634._.js
│  │  │  ├─ [root-of-the-server]__49fd8634._.js.map
│  │  │  ├─ [root-of-the-server]__527cd323._.js
│  │  │  ├─ [root-of-the-server]__527cd323._.js.map
│  │  │  ├─ [root-of-the-server]__923cb372._.js
│  │  │  ├─ [root-of-the-server]__923cb372._.js.map
│  │  │  ├─ [root-of-the-server]__ec07ee34._.js
│  │  │  ├─ [root-of-the-server]__ec07ee34._.js.map
│  │  │  ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_61dcf9ba._.js
│  │  │  ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_61dcf9ba._.js.map
│  │  │  ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_66796270._.js
│  │  │  ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_fd44f5a4._.js
│  │  │  ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_fd44f5a4._.js.map
│  │  │  ├─ _056e2a6e._.js
│  │  │  ├─ _056e2a6e._.js.map
│  │  │  ├─ _1c7a5654._.js
│  │  │  ├─ _1c7a5654._.js.map
│  │  │  ├─ _25eb3154._.js
│  │  │  ├─ _25eb3154._.js.map
│  │  │  ├─ _33ded06a._.js
│  │  │  ├─ _33ded06a._.js.map
│  │  │  ├─ _93808211._.js
│  │  │  ├─ _93808211._.js.map
│  │  │  ├─ _ab75cf68._.js
│  │  │  ├─ _ab75cf68._.js.map
│  │  │  ├─ _c9119c99._.js
│  │  │  ├─ _c9119c99._.js.map
│  │  │  ├─ _d05a2ef6._.js
│  │  │  ├─ _d05a2ef6._.js.map
│  │  │  ├─ _e69f0d32._.js
│  │  │  ├─ _f87c8cfa._.js
│  │  │  ├─ _f87c8cfa._.js.map
│  │  │  ├─ _fadcce58._.js
│  │  │  ├─ _fadcce58._.js.map
│  │  │  ├─ _fd4ce147._.js
│  │  │  ├─ _fd4ce147._.js.map
│  │  │  ├─ app
│  │  │  │  ├─ [locale]
│  │  │  │  │  ├─ api
│  │  │  │  │  │  ├─ auth
│  │  │  │  │  │  │  ├─ signout
│  │  │  │  │  │  │  │  └─ route-7289048675363cc9.js
│  │  │  │  │  │  │  └─ signup
│  │  │  │  │  │  │     └─ route-42520d3216e51db2.js
│  │  │  │  │  │  ├─ create-admin
│  │  │  │  │  │  │  └─ route-04100a9fa6bde295.js
│  │  │  │  │  │  ├─ delete-pending-user
│  │  │  │  │  │  │  └─ route-5e2f756e8fc00169.js
│  │  │  │  │  │  ├─ send-approval-email
│  │  │  │  │  │  │  └─ route-0d008aa02bc4108c.js
│  │  │  │  │  │  └─ send-document-email
│  │  │  │  │  │     └─ route-a659849c779b60dc.js
│  │  │  │  │  ├─ auth
│  │  │  │  │  │  ├─ callback
│  │  │  │  │  │  │  └─ route-a066c1a3a07d9ce5.js
│  │  │  │  │  │  ├─ confirmation
│  │  │  │  │  │  │  └─ page-a69b6ccd509033da.js
│  │  │  │  │  │  └─ confirmed
│  │  │  │  │  │     └─ page-ee953925f5c84ed6.js
│  │  │  │  │  ├─ dashboard
│  │  │  │  │  │  ├─ admin
│  │  │  │  │  │  │  ├─ admin
│  │  │  │  │  │  │  │  └─ page-a0e3a55f2d215db9.js
│  │  │  │  │  │  │  ├─ documents
│  │  │  │  │  │  │  │  ├─ new
│  │  │  │  │  │  │  │  │  └─ page-5065da57f2033a1f.js
│  │  │  │  │  │  │  │  └─ syllabus
│  │  │  │  │  │  │  │     └─ page-10f5480dfaccd648.js
│  │  │  │  │  │  │  ├─ email
│  │  │  │  │  │  │  │  └─ page-1625f7088c8ad8d9.js
│  │  │  │  │  │  │  ├─ folders
│  │  │  │  │  │  │  │  ├─ [category]
│  │  │  │  │  │  │  │  │  └─ page-6d3d6ae4c7b629fd.js
│  │  │  │  │  │  │  │  └─ page-6ca27d81d9237ee1.js
│  │  │  │  │  │  │  ├─ formation-personnel
│  │  │  │  │  │  │  │  └─ page-defcc169c19a7d97.js
│  │  │  │  │  │  │  ├─ layout-3af2eb2a15e735f1.js
│  │  │  │  │  │  │  ├─ page-e73c51fab692bf15.js
│  │  │  │  │  │  │  ├─ pending-users
│  │  │  │  │  │  │  │  └─ page-3c6fcb2f06b973fa.js
│  │  │  │  │  │  │  └─ users
│  │  │  │  │  │  │     └─ page-5e3acffe7b464e98.js
│  │  │  │  │  │  ├─ formant
│  │  │  │  │  │  │  ├─ document
│  │  │  │  │  │  │  │  └─ new
│  │  │  │  │  │  │  │     └─ page-c72244155c07cf5b.js
│  │  │  │  │  │  │  ├─ documents
│  │  │  │  │  │  │  │  └─ new
│  │  │  │  │  │  │  │     └─ page-0c33ba28dd54cc49.js
│  │  │  │  │  │  │  ├─ folders
│  │  │  │  │  │  │  │  ├─ [category]
│  │  │  │  │  │  │  │  │  └─ page-6c98f4762aa206de.js
│  │  │  │  │  │  │  │  └─ page-916e58787e70ac75.js
│  │  │  │  │  │  │  ├─ formation-personnel
│  │  │  │  │  │  │  │  └─ page-f6d91acac7687ccf.js
│  │  │  │  │  │  │  ├─ layout-bf6be5006ec86a7f.js
│  │  │  │  │  │  │  ├─ page-dd2fa3a1749d825f.js
│  │  │  │  │  │  │  └─ users
│  │  │  │  │  │  │     └─ page-b4ec63bddf9a4e0f.js
│  │  │  │  │  │  ├─ formee
│  │  │  │  │  │  │  ├─ documents
│  │  │  │  │  │  │  │  └─ new
│  │  │  │  │  │  │  │     └─ page-0d6d15a3e60683c4.js
│  │  │  │  │  │  │  ├─ folders
│  │  │  │  │  │  │  │  ├─ [category]
│  │  │  │  │  │  │  │  │  └─ page-1c9561b29c242ed3.js
│  │  │  │  │  │  │  │  └─ page-95772508f66fa75c.js
│  │  │  │  │  │  │  ├─ formation-personnel
│  │  │  │  │  │  │  │  └─ page-c4e6b04b544dd1d1.js
│  │  │  │  │  │  │  ├─ layout-ca063986ffa2f8ad.js
│  │  │  │  │  │  │  ├─ page-91e5940b43601211.js
│  │  │  │  │  │  │  └─ users
│  │  │  │  │  │  │     └─ page-4dded9f664e88519.js
│  │  │  │  │  │  └─ page-ed250bf49252a945.js
│  │  │  │  │  ├─ layout-4fba8acd56abefaa.js
│  │  │  │  │  ├─ logout
│  │  │  │  │  │  └─ route-eefa1cdf5dbde95b.js
│  │  │  │  │  ├─ page-b610fa6feb3561fb.js
│  │  │  │  │  ├─ setup
│  │  │  │  │  │  └─ page-2ddc9ac13ee24704.js
│  │  │  │  │  └─ signup
│  │  │  │  │     └─ page-ef42a685aeafd4e8.js
│  │  │  │  ├─ _not-found
│  │  │  │  │  └─ page-74d5a6babf898609.js
│  │  │  │  └─ api
│  │  │  │     ├─ delete-pending-user
│  │  │  │     │  └─ route-5202da5e54ccbacd.js
│  │  │  │     └─ send-approval-email
│  │  │  │        └─ route-07771402337c479c.js
│  │  │  ├─ bef6a_[locale]_dashboard_formant_workshops_[workshop]_[___folder]_page_tsx_cb3c8e66._.js
│  │  │  ├─ bef6a_[locale]_dashboard_formee_workshops_[workshop]_[___folder]_page_tsx_65a1c583._.js
│  │  │  ├─ f4898fe8-21857011633a508d.js
│  │  │  ├─ framework-5bd22f607ebc7826.js
│  │  │  ├─ main-5253c13f24252a32.js
│  │  │  ├─ main-app-b21ad418a24852bf.js
│  │  │  ├─ pages
│  │  │  │  ├─ _app-eb694f3fd49020c8.js
│  │  │  │  ├─ _app.js
│  │  │  │  ├─ _error-2b3482c094a540b4.js
│  │  │  │  └─ _error.js
│  │  │  ├─ pages__app_049595de._.js
│  │  │  ├─ pages__app_049595de._.js.map
│  │  │  ├─ pages__app_5771e187._.js
│  │  │  ├─ pages__error_5771e187._.js
│  │  │  ├─ pages__error_c5ed9705._.js
│  │  │  ├─ pages__error_c5ed9705._.js.map
│  │  │  ├─ polyfills-42372ed130431b0a.js
│  │  │  ├─ src_0294f211._.js
│  │  │  ├─ src_0294f211._.js.map
│  │  │  ├─ src_059eaad3._.js
│  │  │  ├─ src_059eaad3._.js.map
│  │  │  ├─ src_0d0d17b2._.js
│  │  │  ├─ src_0d0d17b2._.js.map
│  │  │  ├─ src_29324bf1._.js
│  │  │  ├─ src_29324bf1._.js.map
│  │  │  ├─ src_2b7e3ed1._.js
│  │  │  ├─ src_2b7e3ed1._.js.map
│  │  │  ├─ src_300102fe._.js
│  │  │  ├─ src_300102fe._.js.map
│  │  │  ├─ src_335152c2._.js
│  │  │  ├─ src_335152c2._.js.map
│  │  │  ├─ src_459bc397._.js
│  │  │  ├─ src_459bc397._.js.map
│  │  │  ├─ src_45d61b4d._.js
│  │  │  ├─ src_45d61b4d._.js.map
│  │  │  ├─ src_462492a4._.js
│  │  │  ├─ src_462492a4._.js.map
│  │  │  ├─ src_52a975d6._.js
│  │  │  ├─ src_52a975d6._.js.map
│  │  │  ├─ src_53a1705a._.js
│  │  │  ├─ src_53a1705a._.js.map
│  │  │  ├─ src_5456ce20._.js
│  │  │  ├─ src_5456ce20._.js.map
│  │  │  ├─ src_5d43b26b._.js
│  │  │  ├─ src_5d43b26b._.js.map
│  │  │  ├─ src_63f7c0f7._.js
│  │  │  ├─ src_63f7c0f7._.js.map
│  │  │  ├─ src_6e9da967._.js
│  │  │  ├─ src_6e9da967._.js.map
│  │  │  ├─ src_74baf17d._.js
│  │  │  ├─ src_74baf17d._.js.map
│  │  │  ├─ src_77d57cb7._.js
│  │  │  ├─ src_77d57cb7._.js.map
│  │  │  ├─ src_7afbf472._.js
│  │  │  ├─ src_7afbf472._.js.map
│  │  │  ├─ src_817e96e6._.js
│  │  │  ├─ src_817e96e6._.js.map
│  │  │  ├─ src_82f782d9._.js
│  │  │  ├─ src_82f782d9._.js.map
│  │  │  ├─ src_88df1a7b._.js
│  │  │  ├─ src_88df1a7b._.js.map
│  │  │  ├─ src_8fabf948._.js
│  │  │  ├─ src_8fabf948._.js.map
│  │  │  ├─ src_91469b97._.js
│  │  │  ├─ src_91469b97._.js.map
│  │  │  ├─ src_a65ffcc0._.js
│  │  │  ├─ src_a65ffcc0._.js.map
│  │  │  ├─ src_app_[locale]_dashboard_admin_email_page_tsx_d1a8d4d2._.js
│  │  │  ├─ src_app_[locale]_dashboard_admin_folders_[category]_page_tsx_d1a8d4d2._.js
│  │  │  ├─ src_app_[locale]_dashboard_admin_folders_page_tsx_d1a8d4d2._.js
│  │  │  ├─ src_app_[locale]_dashboard_admin_formation-personnel_page_tsx_d1a8d4d2._.js
│  │  │  ├─ src_app_[locale]_dashboard_admin_layout_tsx_278d1ab5._.js
│  │  │  ├─ src_app_[locale]_dashboard_admin_page_tsx_d1a8d4d2._.js
│  │  │  ├─ src_app_[locale]_dashboard_admin_workshops_[workshop]_page_tsx_d1a8d4d2._.js
│  │  │  ├─ src_app_[locale]_dashboard_admin_workshops_page_tsx_d1a8d4d2._.js
│  │  │  ├─ src_app_[locale]_dashboard_admin_workshops_upload_page_tsx_d1a8d4d2._.js
│  │  │  ├─ src_app_[locale]_dashboard_editor_layout_tsx_278d1ab5._.js
│  │  │  ├─ src_app_[locale]_dashboard_editor_page_tsx_278d1ab5._.js
│  │  │  ├─ src_app_[locale]_dashboard_editor_page_tsx_ec9cd2f3._.js
│  │  │  ├─ src_app_[locale]_dashboard_formant_folders_page_tsx_cb3c8e66._.js
│  │  │  ├─ src_app_[locale]_dashboard_formant_layout_tsx_278d1ab5._.js
│  │  │  ├─ src_app_[locale]_dashboard_formant_page_tsx_cb3c8e66._.js
│  │  │  ├─ src_app_[locale]_dashboard_formant_users_page_tsx_cb3c8e66._.js
│  │  │  ├─ src_app_[locale]_dashboard_formant_workshops_[workshop]_page_tsx_cb3c8e66._.js
│  │  │  ├─ src_app_[locale]_dashboard_formant_workshops_page_tsx_cb3c8e66._.js
│  │  │  ├─ src_app_[locale]_dashboard_formee_folders_page_tsx_65a1c583._.js
│  │  │  ├─ src_app_[locale]_dashboard_formee_layout_tsx_278d1ab5._.js
│  │  │  ├─ src_app_[locale]_dashboard_formee_page_tsx_65a1c583._.js
│  │  │  ├─ src_app_[locale]_dashboard_formee_workshops_[workshop]_page_tsx_65a1c583._.js
│  │  │  ├─ src_app_[locale]_dashboard_formee_workshops_page_tsx_65a1c583._.js
│  │  │  ├─ src_app_[locale]_dashboard_page_tsx_278d1ab5._.js
│  │  │  ├─ src_app_[locale]_globals_css_f9ee138c._.single.css
│  │  │  ├─ src_app_[locale]_globals_css_f9ee138c._.single.css.map
│  │  │  ├─ src_app_[locale]_layout_tsx_c0237562._.js
│  │  │  ├─ src_app_[locale]_page_tsx_278d1ab5._.js
│  │  │  ├─ src_b2b7e486._.js
│  │  │  ├─ src_b2b7e486._.js.map
│  │  │  ├─ src_b4ec0fce._.js
│  │  │  ├─ src_b4ec0fce._.js.map
│  │  │  ├─ src_components_43466efb._.js
│  │  │  ├─ src_components_43466efb._.js.map
│  │  │  ├─ src_components_auth_LoginForm_tsx_c441ede3._.js
│  │  │  ├─ src_components_auth_LoginForm_tsx_c441ede3._.js.map
│  │  │  ├─ src_d7cef7da._.js
│  │  │  ├─ src_d7cef7da._.js.map
│  │  │  ├─ src_eeebdbaf._.js
│  │  │  ├─ src_eeebdbaf._.js.map
│  │  │  ├─ src_f0e4563e._.js
│  │  │  ├─ src_f0e4563e._.js.map
│  │  │  ├─ src_f2da9b27._.js
│  │  │  ├─ src_f2da9b27._.js.map
│  │  │  └─ webpack-9d68b3568d5d7ae1.js
│  │  ├─ css
│  │  │  └─ 98729b3839a66d98.css
│  │  ├─ development
│  │  │  ├─ _buildManifest.js
│  │  │  ├─ _clientMiddlewareManifest.json
│  │  │  └─ _ssgManifest.js
│  │  ├─ jWFnIUkg2hfZQjB6n74ki
│  │  │  ├─ _buildManifest.js
│  │  │  └─ _ssgManifest.js
│  │  └─ media
│  │     ├─ 569ce4b8f30dc480-s.p.woff2
│  │     ├─ 747892c23ea88013-s.woff2
│  │     ├─ 8d697b304b401681-s.woff2
│  │     ├─ 93f479601ee12b01-s.p.woff2
│  │     ├─ 9610d9e46709d722-s.woff2
│  │     ├─ ba015fad6dcf6784-s.woff2
│  │     ├─ gyByhwUxId8gMEwSGFWNOITddY4-s.81df3a5b.woff2
│  │     ├─ gyByhwUxId8gMEwYGFWNOITddY4-s.b7d310ad.woff2
│  │     ├─ gyByhwUxId8gMEwcGFWNOITd-s.p.da1ebef7.woff2
│  │     ├─ or3nQ6H_1_WfwkMZI_qYFrMdmhHkjkotbA-s.cb6bbcb1.woff2
│  │     ├─ or3nQ6H_1_WfwkMZI_qYFrcdmhHkjko-s.p.be19f591.woff2
│  │     └─ or3nQ6H_1_WfwkMZI_qYFrkdmhHkjkotbA-s.e32db976.woff2
│  ├─ trace
│  ├─ transform.js
│  ├─ transform.js.map
│  └─ types
│     ├─ app
│     │  ├─ [locale]
│     │  │  ├─ api
│     │  │  │  ├─ auth
│     │  │  │  │  ├─ signout
│     │  │  │  │  │  └─ route.ts
│     │  │  │  │  └─ signup
│     │  │  │  │     └─ route.ts
│     │  │  │  ├─ create-admin
│     │  │  │  │  └─ route.ts
│     │  │  │  ├─ delete-pending-user
│     │  │  │  │  └─ route.ts
│     │  │  │  ├─ send-approval-email
│     │  │  │  │  └─ route.ts
│     │  │  │  └─ send-document-email
│     │  │  │     └─ route.ts
│     │  │  ├─ auth
│     │  │  │  ├─ callback
│     │  │  │  │  └─ route.ts
│     │  │  │  ├─ confirmation
│     │  │  │  │  └─ page.ts
│     │  │  │  └─ confirmed
│     │  │  │     └─ page.ts
│     │  │  ├─ dashboard
│     │  │  │  ├─ admin
│     │  │  │  │  ├─ admin
│     │  │  │  │  │  └─ page.ts
│     │  │  │  │  ├─ documents
│     │  │  │  │  │  ├─ new
│     │  │  │  │  │  │  └─ page.ts
│     │  │  │  │  │  └─ syllabus
│     │  │  │  │  │     └─ page.ts
│     │  │  │  │  ├─ email
│     │  │  │  │  │  └─ page.ts
│     │  │  │  │  ├─ folders
│     │  │  │  │  │  ├─ [category]
│     │  │  │  │  │  │  └─ page.ts
│     │  │  │  │  │  └─ page.ts
│     │  │  │  │  ├─ formation-personnel
│     │  │  │  │  │  └─ page.ts
│     │  │  │  │  ├─ layout.ts
│     │  │  │  │  ├─ page.ts
│     │  │  │  │  ├─ pending-users
│     │  │  │  │  │  └─ page.ts
│     │  │  │  │  └─ users
│     │  │  │  │     └─ page.ts
│     │  │  │  ├─ formant
│     │  │  │  │  ├─ document
│     │  │  │  │  │  └─ new
│     │  │  │  │  │     └─ page.ts
│     │  │  │  │  ├─ documents
│     │  │  │  │  │  └─ new
│     │  │  │  │  │     └─ page.ts
│     │  │  │  │  ├─ folders
│     │  │  │  │  │  ├─ [category]
│     │  │  │  │  │  │  └─ page.ts
│     │  │  │  │  │  └─ page.ts
│     │  │  │  │  ├─ formation-personnel
│     │  │  │  │  │  └─ page.ts
│     │  │  │  │  ├─ layout.ts
│     │  │  │  │  ├─ page.ts
│     │  │  │  │  └─ users
│     │  │  │  │     └─ page.ts
│     │  │  │  ├─ formee
│     │  │  │  │  ├─ documents
│     │  │  │  │  │  └─ new
│     │  │  │  │  │     └─ page.ts
│     │  │  │  │  ├─ folders
│     │  │  │  │  │  ├─ [category]
│     │  │  │  │  │  │  └─ page.ts
│     │  │  │  │  │  └─ page.ts
│     │  │  │  │  ├─ formation-personnel
│     │  │  │  │  │  └─ page.ts
│     │  │  │  │  ├─ layout.ts
│     │  │  │  │  ├─ page.ts
│     │  │  │  │  └─ users
│     │  │  │  │     └─ page.ts
│     │  │  │  └─ page.ts
│     │  │  ├─ layout.ts
│     │  │  ├─ logout
│     │  │  │  └─ route.ts
│     │  │  ├─ page.ts
│     │  │  ├─ setup
│     │  │  │  └─ page.ts
│     │  │  └─ signup
│     │  │     └─ page.ts
│     │  └─ api
│     │     ├─ delete-pending-user
│     │     │  └─ route.ts
│     │     └─ send-approval-email
│     │        └─ route.ts
│     ├─ cache-life.d.ts
│     ├─ package.json
│     └─ server.d.ts
├─ README.md
├─ ROLE_MIGRATION_SUMMARY.md
├─ eslint.config.mjs
├─ next.config.mjs
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ public
│  ├─ Rechnung_Teilzahlung_QLP_OSFS_800EUR.pdf
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ logo.png
│  ├─ next.svg
│  ├─ oblate-logo.svg
│  ├─ vercel.svg
│  └─ window.svg
├─ schema_dump.sql
├─ src
│  ├─ app
│  │  ├─ [locale]
│  │  │  ├─ api
│  │  │  │  ├─ auth
│  │  │  │  │  ├─ signout
│  │  │  │  │  │  └─ route.ts
│  │  │  │  │  └─ signup
│  │  │  │  │     └─ route.ts
│  │  │  │  ├─ create-admin
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ delete-pending-user
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ send-approval-email
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ send-document-email
│  │  │  │     └─ route.ts
│  │  │  ├─ auth
│  │  │  │  ├─ callback
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ confirmation
│  │  │  │  │  └─ page.tsx
│  │  │  │  └─ confirmed
│  │  │  │     └─ page.tsx
│  │  │  ├─ dashboard
│  │  │  │  ├─ admin
│  │  │  │  │  ├─ DashboardClient.tsx
│  │  │  │  │  ├─ admin
│  │  │  │  │  │  ├─ components
│  │  │  │  │  │  │  └─ FormeeIntroductionForm.tsx
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  ├─ documents
│  │  │  │  │  │  ├─ new
│  │  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  │  └─ syllabus
│  │  │  │  │  │     └─ page.tsx
│  │  │  │  │  ├─ email
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  ├─ folders
│  │  │  │  │  │  ├─ [category]
│  │  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  ├─ formation-personnel
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  ├─ layout.tsx
│  │  │  │  │  ├─ metadata.tsx
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  ├─ pending-users
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  ├─ users
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  └─ workshops
│  │  │  │  │     ├─ [workshop]
│  │  │  │  │     │  └─ [...folder]
│  │  │  │  │     │     └─ page.tsx
│  │  │  │  │     ├─ page.tsx
│  │  │  │  │     └─ upload
│  │  │  │  │        └─ page.tsx
│  │  │  │  ├─ editor
│  │  │  │  │  ├─ DashboardClient.tsx
│  │  │  │  │  ├─ document
│  │  │  │  │  │  └─ new
│  │  │  │  │  │     └─ page.tsx
│  │  │  │  │  ├─ documents
│  │  │  │  │  │  └─ new
│  │  │  │  │  │     └─ page.tsx
│  │  │  │  │  ├─ folders
│  │  │  │  │  │  ├─ [category]
│  │  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  ├─ formation-personnel
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  ├─ layout.tsx
│  │  │  │  │  ├─ metadata.tsx
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  ├─ users
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  └─ workshops
│  │  │  │  │     ├─ [workshop]
│  │  │  │  │     │  ├─ [...folder]
│  │  │  │  │     │  │  └─ page.tsx
│  │  │  │  │     │  └─ page.tsx
│  │  │  │  │     └─ page.tsx
│  │  │  │  ├─ formator
│  │  │  │  │  └─ workshops
│  │  │  │  │     └─ [workshop]
│  │  │  │  │        └─ [...folder]
│  │  │  │  │           └─ page.tsx
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ user
│  │  │  │     ├─ DashboardClient.tsx
│  │  │  │     ├─ documents
│  │  │  │     │  └─ new
│  │  │  │     │     └─ page.tsx
│  │  │  │     ├─ folders
│  │  │  │     │  ├─ [category]
│  │  │  │     │  │  └─ page.tsx
│  │  │  │     │  └─ page.tsx
│  │  │  │     ├─ formation-personnel
│  │  │  │     │  └─ page.tsx
│  │  │  │     ├─ layout.tsx
│  │  │  │     ├─ metadata.tsx
│  │  │  │     ├─ page.tsx
│  │  │  │     ├─ users
│  │  │  │     │  └─ page.tsx
│  │  │  │     └─ workshops
│  │  │  │        ├─ [workshop]
│  │  │  │        │  ├─ [...folder]
│  │  │  │        │  │  └─ page.tsx
│  │  │  │        │  └─ page.tsx
│  │  │  │        └─ page.tsx
│  │  │  ├─ favicon.ico
│  │  │  ├─ formation-personnel
│  │  │  ├─ formee-introduction
│  │  │  ├─ globals.css
│  │  │  ├─ layout.tsx
│  │  │  ├─ logout
│  │  │  │  └─ route.ts
│  │  │  ├─ page.tsx
│  │  │  ├─ setup
│  │  │  │  └─ page.tsx
│  │  │  └─ signup
│  │  │     └─ page.tsx
│  │  └─ api
│  │     ├─ delete-pending-user
│  │     │  └─ route.ts
│  │     └─ send-approval-email
│  │        └─ route.ts
│  ├─ components
│  │  ├─ admin
│  │  │  ├─ AdminAdvancedFilters.tsx
│  │  │  ├─ DocumentCard.tsx
│  │  │  ├─ DocumentList.tsx
│  │  │  ├─ DocumentRow.tsx
│  │  │  ├─ DocumentsFilters.tsx
│  │  │  ├─ DocumentsList.tsx
│  │  │  ├─ Header.tsx
│  │  │  ├─ PaginationControls.tsx
│  │  │  ├─ PendingUsersList.tsx
│  │  │  ├─ PendingUsersTable.tsx
│  │  │  ├─ Sidebar.tsx
│  │  │  ├─ SortableHeader.tsx
│  │  │  ├─ documents
│  │  │  │  ├─ CheckboxField.tsx
│  │  │  │  ├─ DatalistField.tsx
│  │  │  │  ├─ FileDropzone.tsx
│  │  │  │  ├─ FormField.tsx
│  │  │  │  ├─ MultiSelectButtons.tsx
│  │  │  │  ├─ SelectField.tsx
│  │  │  │  ├─ UploadForm.tsx
│  │  │  │  └─ UploadProgress.tsx
│  │  │  ├─ email
│  │  │  │  ├─ DocumentRow.tsx
│  │  │  │  ├─ DocumentTable.tsx
│  │  │  │  ├─ DocumentsTable.tsx
│  │  │  │  ├─ EmailClient.tsx
│  │  │  │  ├─ EmailFilters.tsx
│  │  │  │  ├─ LanguageFlag.tsx
│  │  │  │  ├─ UserRow.tsx
│  │  │  │  ├─ UserTable.tsx
│  │  │  │  ├─ UsersTable.tsx
│  │  │  │  ├─ WorkflowSteps.tsx
│  │  │  │  ├─ cards
│  │  │  │  │  ├─ DocumentsCard.tsx
│  │  │  │  │  ├─ StatusMessages.tsx
│  │  │  │  │  └─ UsersCard.tsx
│  │  │  │  ├─ types.ts
│  │  │  │  └─ useEmailNotifications.ts
│  │  │  ├─ syllabus
│  │  │  │  ├─ SyllabusFileList.tsx
│  │  │  │  ├─ SyllabusFormFields.tsx
│  │  │  │  ├─ SyllabusListStates.tsx
│  │  │  │  ├─ SyllabusTableRow.tsx
│  │  │  │  └─ SyllabusUploadForm.tsx
│  │  │  ├─ users
│  │  │  │  ├─ AddUserForm.tsx
│  │  │  │  ├─ AddUserModal.tsx
│  │  │  │  ├─ FormatorUserTable.tsx
│  │  │  │  ├─ FormeeUserTable.tsx
│  │  │  │  └─ UserManagementClient.tsx
│  │  │  └─ workshops
│  │  │     ├─ FileUploadForm.tsx
│  │  │     ├─ WorkshopFilesList.tsx
│  │  │     └─ WorkshopUploadForm.tsx
│  │  ├─ auth
│  │  │  ├─ LoginForm.tsx
│  │  │  └─ SignUpForm.tsx
│  │  ├─ editor
│  │  │  ├─ AdminAdvancedFilters.tsx
│  │  │  ├─ DocumentCard.tsx
│  │  │  ├─ DocumentList.tsx
│  │  │  ├─ DocumentRow.tsx
│  │  │  ├─ DocumentsFilters.tsx
│  │  │  ├─ DocumentsList.tsx
│  │  │  ├─ Header.tsx
│  │  │  ├─ PaginationControls.tsx
│  │  │  ├─ SortableHeader.tsx
│  │  │  ├─ documents
│  │  │  │  ├─ CheckboxField.tsx
│  │  │  │  ├─ DatalistField.tsx
│  │  │  │  ├─ FileDropzone.tsx
│  │  │  │  ├─ FormField.tsx
│  │  │  │  ├─ MultiSelectButtons.tsx
│  │  │  │  ├─ SelectField.tsx
│  │  │  │  ├─ UploadForm.tsx
│  │  │  │  └─ UploadProgress.tsx
│  │  │  └─ users
│  │  │     ├─ AddUserForm.tsx
│  │  │     ├─ AddUserModal.tsx
│  │  │     ├─ FormatorUserTable.tsx
│  │  │     ├─ FormeeUserTable.tsx
│  │  │     └─ UserManagementClient.tsx
│  │  ├─ formation
│  │  │  └─ MemberCard.tsx
│  │  ├─ shared
│  │  │  ├─ AdvancedFilters.tsx
│  │  │  ├─ DocumentsFilters.tsx
│  │  │  ├─ FilterMultiSelect.tsx
│  │  │  ├─ FolderComponent.tsx
│  │  │  ├─ PaginationControls.tsx
│  │  │  └─ SimpleDocumentCard.tsx
│  │  ├─ ui
│  │  │  ├─ AuthForm.tsx
│  │  │  ├─ Avatar.tsx
│  │  │  ├─ Button.tsx
│  │  │  ├─ FileIcon.tsx
│  │  │  ├─ Input.tsx
│  │  │  ├─ LanguageSwitcher.tsx
│  │  │  ├─ Modal.tsx
│  │  │  ├─ UserAvatar.tsx
│  │  │  ├─ card.tsx
│  │  │  └─ tabs.tsx
│  │  └─ user
│  │     ├─ AdminAdvancedFilters.tsx
│  │     ├─ DocumentCard.tsx
│  │     ├─ DocumentList.tsx
│  │     ├─ DocumentRow.tsx
│  │     ├─ DocumentsFilters.tsx
│  │     ├─ DocumentsList.tsx
│  │     ├─ FormeeIntroductionHook.tsx
│  │     ├─ FormeeIntroductionModal.tsx
│  │     ├─ Header.tsx
│  │     ├─ PaginationControls.tsx
│  │     ├─ SortableHeader.tsx
│  │     ├─ documents
│  │     │  ├─ CheckboxField.tsx
│  │     │  ├─ DatalistField.tsx
│  │     │  ├─ FileDropzone.tsx
│  │     │  ├─ FormField.tsx
│  │     │  ├─ MultiSelectButtons.tsx
│  │     │  ├─ SelectField.tsx
│  │     │  ├─ UploadForm.tsx
│  │     │  └─ UploadProgress.tsx
│  │     └─ users
│  │        ├─ AddUserForm.tsx
│  │        ├─ AddUserModal.tsx
│  │        ├─ FormatorUserTable.tsx
│  │        ├─ FormeeUserTable.tsx
│  │        └─ UserManagementClient.tsx
│  ├─ contexts
│  │  └─ AuthContext.tsx
│  ├─ hooks
│  │  ├─ useDocumentUpload.ts
│  │  ├─ useWorkshopDocumentUpload.ts
│  │  └─ useWorkshopFiles.ts
│  ├─ i18n
│  │  ├─ navigation.ts
│  │  ├─ request.ts
│  │  └─ routing.ts
│  ├─ i18n.ts
│  ├─ lib
│  │  ├─ auth
│  │  ├─ supabase
│  │  │  ├─ admin.ts
│  │  │  ├─ browser-client.ts
│  │  │  ├─ middleware-client.ts
│  │  │  └─ server-client.ts
│  │  ├─ utils
│  │  │  ├─ auth-routes.ts
│  │  │  ├─ file-icons.ts
│  │  │  ├─ format.ts
│  │  │  ├─ locale.ts
│  │  │  ├─ routes.ts
│  │  │  └─ urls.ts
│  │  ├─ utils.ts
│  │  └─ wordpress
│  │     ├─ api.ts
│  │     └─ types.ts
│  ├─ locales
│  │  ├─ de.json
│  │  ├─ en.json
│  │  ├─ es.json
│  │  ├─ fr.json
│  │  ├─ it.json
│  │  ├─ nl.json
│  │  └─ pt.json
│  ├─ messages
│  │  ├─ en.json
│  │  └─ fr.json
│  ├─ middleware.ts
│  ├─ services
│  └─ types
│     ├─ document.ts
│     ├─ supabase.ts
│     └─ workshop.ts
├─ storage_policies.sql
├─ supabase
│  ├─ .branches
│  │  └─ _current_branch
│  ├─ .temp
│  │  ├─ cli-latest
│  │  ├─ gotrue-version
│  │  ├─ pooler-url
│  │  ├─ postgres-version
│  │  ├─ project-ref
│  │  ├─ rest-version
│  │  └─ storage-version
│  ├─ config.toml
│  ├─ migrations
│  │  ├─ 20240518170000_create_timestamp_function.sql
│  │  ├─ 20240518180000_create_workshops_table.sql
│  │  ├─ 20240518185000_add_file_columns_to_workshops.sql
│  │  ├─ 20240518190000_create_workshop_files_table.sql
│  │  ├─ 20250430100825_init.sql
│  │  ├─ 20250430110000_add_role_to_profiles.sql
│  │  ├─ 20250430110001_fix_user_role_enum.sql
│  │  ├─ 20250430115000_add_documents_table.sql
│  │  ├─ 20250430120000_create_admin_user.sql
│  │  ├─ 20250430120001_fix_infinite_recursion.sql
│  │  ├─ 20250430130000_fix_admin_user.sql
│  │  ├─ 20250430140000_fix_null_fields_in_admin_user.sql
│  │  ├─ 20250430212801_create_get_category_counts_function.sql
│  │  ├─ 20250430231210_update_user_roles_v2.sql
│  │  ├─ 20250501000000_fix_email_change_field.sql
│  │  ├─ 20250501010000_fix_email_change_token_new.sql
│  │  ├─ 20250502000000_update_handle_new_user.sql
│  │  ├─ 20250502000729_update_handle_new_user_v2.sql
│  │  ├─ 20250502002032_add_admin_select_profiles_policy.sql
│  │  ├─ 20250502002252_create_is_admin_func_and_update_policy.sql
│  │  ├─ 20250502011951_fix_documents_admin_rls.sql
│  │  ├─ 20250504191056_add_common_syllabus_storage_policies.sql
│  │  ├─ 20250504191900_create_moddatetime_function.sql
│  │  ├─ 20250504191901_create_syllabus_documents.sql
│  │  ├─ 20250505222827_create_formee_introduction.sql
│  │  ├─ 20250516153000_add_documents_storage_policies.sql
│  │  ├─ 20250516164500_add_documents_insert_policy.sql
│  │  ├─ 20250516170000_allow_authenticated_storage_read.sql
│  │  ├─ 20250516170001_add_approval_status_to_profiles.sql
│  │  ├─ 20250516180000_fix_user_role_type.sql
│  │  ├─ 20250516180001_add_workshops_storage_policies.sql
│  │  ├─ 20250516230000_update_workshop_storage_policies.sql
│  │  ├─ 20250516240000_add_formee_workshop_read_policy.sql
│  │  └─ 20250516250000_fix_workshop_storage_policies.sql
│  └─ supabase
│     ├─ .temp
│     │  └─ cli-latest
│     ├─ config.toml
│     └─ functions
├─ tailwind.config.mjs
└─ tsconfig.json

```