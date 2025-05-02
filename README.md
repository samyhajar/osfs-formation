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