export const productsList = [
  {
    id: '82f6040a-b0fe-4e29-855d-0f30e960ab96',
    title: 'iPhone 9',
    description: 'An apple mobile which is nothing like apple',
    price: 549,
  },
  {
    id: 'f64f41e1-a423-4e5d-9e99-8e7a17ac9e04',
    title: 'iPhone X',
    description:
      'SIM-Free, Model A19211 6.5-inch Super Retina HD display with OLED technology A12 Bionic chip with ...',
    price: 899,
  },
  {
    id: '6852273d-0ce7-4916-ad66-022b6d0eb424',
    title: 'Samsung Universe 9',
    description:
      "Samsung's new variant which goes beyond Galaxy to the Universe",
    price: 1249,
  },
  {
    id: '31e2192d-f2d1-4b22-94ac-0ab2017475c9',
    title: 'OPPOF19',
    description: 'OPPO F19 is officially announced on April 2021.',
    price: 280,
  },
  {
    id: '624de57f-98ca-46cb-815b-449978f8fb65',
    title: 'Huawei P30',
    description:
      'Huawei’s re-badged P30 Pro New Edition was officially unveiled yesterday in Germany and now the device has made its way to the UK.',
    price: 499,
  },
  {
    id: '968e67e5-ce29-40ba-a443-32f6b3b538f7',
    title: 'MacBook Pro',
    description:
      'MacBook Pro 2021 with mini-LED display may launch between September, November',
    price: 1749,
  },
  {
    id: '1696d5fa-2dca-4cc9-9c3c-0d53524d2de3',
    title: 'Samsung Galaxy Book',
    description:
      'Samsung Galaxy Book S (2020) Laptop With Intel Lakefield Chip, 8GB of RAM Launched',
    price: 1499,
  },
  {
    id: '842ab817-c7b5-4724-9b0c-0575e8726043',
    title: 'Microsoft Surface Laptop 4',
    description:
      'Style and speed. Stand out on HD video calls backed by Studio Mics. Capture ideas on the vibrant touchscreen.',
    price: 1499,
  },
  {
    id: '02edea76-9340-4a1f-bdbc-d39115fc5372',
    title: 'Infinix INBOOK',
    description:
      'Infinix Inbook X1 Ci3 10th 8GB 256GB 14 Win10 Grey – 1 Year Warranty',
    price: 1099,
  },
  {
    id: '5212ede8-b7b0-45e7-acf7-f5c27355550f',
    title: 'HP Pavilion 15-DK1056WM',
    description:
      'HP Pavilion 15-DK1056WM Gaming Laptop 10th Gen Core i5, 8GB, 256GB SSD, GTX 1650 4GB, Windows 10',
    price: '1099',
  },
];

export const mockedSQSEvent = {
  Records: [
    {
      messageId: '329e489b-5330-4525-accc-0fd9b53ae020',
      receiptHandle:
        'AQEB1I7UXWQGSZOnnXBxLI5P8T/7yLMnYJs457CKW1qhTiijNs5kRyfD5MRJaNizoFXQ/2ah9zbfvp0YYRl+T1gm06XktRQCUO/WWiYgFeE/1ALTOw1ebuhlAIRk1cIIo1sgQxAiwyFTjNbbUzr4hGxpQOX8gbvPYz3KjeMTKySUZRkOg5NKz2lp8EBlANtO6DDTbtIjIADCZbyLlspRx7W2J2d8a01OCIqFlWm1jzC8s94gkEoNnabI7qWWKMC3omWCZ5Z5udJJ0WV+RgwhSvRewWNvdXCjMF5rFq4UWtmUcKvpx8oQBfVU4F7DHH6/fTaYAEM9xMbyJCukth0HExqZaXf5GyqcOeoHqAK/pFS1yVgo7cZ0iC0FcDMc0+hAx9CdiBQWdraSyCCI+6A6X94xtg==',
      body: '{"id":"41b1fab1-6b73-4e36-99d3-fe3c3dcee666","title":"cereals muesli fruit nuts","description":"original fauji cereal muesli 250gm box pack original fauji cereals muesli fruit nuts flakes breakfast cereal break fast faujicereals cerels cerel foji fouji","price":"46","count":"113"}',
      attributes: {
        ApproximateReceiveCount: '1',
        AWSTraceHeader:
          'Root=1-6499f795-0798ded11c0d79353a48ad89;Parent=6e879f587484d5a5;Sampled=0;Lineage=da4fc832:0',
        SentTimestamp: '1687811991244',
        SenderId:
          'AROAVGKTXYSDAQZ3TLYST:ImportServiceStack-ImportFileParserLambda70994A6B-aisp78Gy9dtI',
        ApproximateFirstReceiveTimestamp: '1687811991247',
      },
      messageAttributes: {},
      md5OfBody: '05cd4d26e8be711700a99a0f64386a6b',
      eventSource: 'aws:sqs',
      eventSourceARN:
        'arn:aws:sqs:eu-central-1:357194777734:catalog-items-queue',
      awsRegion: 'eu-central-1',
    },
    {
      messageId: '2f55a71e-39e1-40d4-b39c-afde05eb3518',
      receiptHandle:
        'AQEB58mcl1ooodR6x80QTm7s85LkaSVQ6CyRuh2+iLLN0sSq2k0BTMrLkQj2ZbxbCk5zQrubcBy9JVRBQPH3vHT3DhOcv9uDZK0qbJ9T9p3uu83IDUAUepfMzaA1k8jbfWvNhDbtdY019iwmDOHGdbK5AHgBabVkGCAEW6mL3jZt/kzPcPuxygCSkBEC1ov8hQdhONY3B3BD7TrEQssilqENB3N30ZhYv86jPNraPo1TZzKhXkfSpe7bL3SE1WoOj8FfPX8DsmByNgH/9JmBoH5zg6RwLTabnOGCOJyd58jJXTP5G/pNVwjNWvkEs1s6iwwafnnTpe5oTH9eAFSH7uEzkIeyVbu4JdID+deDvtRkN8skRNbSIQLUSL8Mw7Fvbw+MLd9ljNNqfWhJ03l2Sor8wg==',
      body: '{"id":"92cb2add-8d4f-489b-b3b7-c981675dcffe","title":"Handcraft Chinese style","description":"Handcraft Chinese style art luxury palace hotel villa mansion home decor ceramic vase with brass fruit plate","price":"60","count":"7"}',
      attributes: {
        ApproximateReceiveCount: '1',
        AWSTraceHeader:
          'Root=1-6499f795-0798ded11c0d79353a48ad89;Parent=6e879f587484d5a5;Sampled=0;Lineage=da4fc832:0',
        SentTimestamp: '1687811991247',
        SenderId:
          'AROAVGKTXYSDAQZ3TLYST:ImportServiceStack-ImportFileParserLambda70994A6B-aisp78Gy9dtI',
        ApproximateFirstReceiveTimestamp: '1687811991251',
      },
      messageAttributes: {},
      md5OfBody: 'f298e53ef9a395d821d62c3776341194',
      eventSource: 'aws:sqs',
      eventSourceARN:
        'arn:aws:sqs:eu-central-1:357194777734:catalog-items-queue',
      awsRegion: 'eu-central-1',
    },
    {
      messageId: '9c0ad8e8-a9aa-47fc-90c5-673e74f75c4d',
      receiptHandle:
        'AQEBgeCvakTOcQjaWbqLngw0pXxROhsmA6G7ZL37SnuGN7bhuuV6AHKfNDOVbMDHz/GgnLlteGJJRiKtjgL8DeUzJElcs9zgDn/SFn6AsGWs3zphbC+E8uAwgCx+3LqMr5FF69nsjbmvOX2Tc5AevWy4t4S56uHCPx0U3s9hfJjAV2AOYbEB6Xf/PC2JWrfp9JHI77QCCoxNsekEr8EpBT7Fm+3spl3h16bdLuIE0PgPSp4kia5tCsjLBmcxafbVXmT650QEJ477/XN576Hn0ee9N+f9MVUL7CBuzUq9WOWY7tdbWIdpV/Fk/+VDePq6ngziAHiDJD8uPEfT0m3eCJm4xghZ/TRIQiaNmkaFfizDeQx4G4ZnQdz5yyJ21aOZRtbyvFCnIrBVlXdm934TI5YAMQ==',
      body: '{"id":"63a50f11-fad4-4cfe-bb20-c2802036ddda","title":"Elbow Macaroni - 400 gm","description":"Product details of Bake Parlor Big Elbow Macaroni - 400 gm","price":"14","count":"146"}',
      attributes: {
        ApproximateReceiveCount: '1',
        AWSTraceHeader:
          'Root=1-6499f795-0798ded11c0d79353a48ad89;Parent=6e879f587484d5a5;Sampled=0;Lineage=da4fc832:0',
        SentTimestamp: '1687811991247',
        SenderId:
          'AROAVGKTXYSDAQZ3TLYST:ImportServiceStack-ImportFileParserLambda70994A6B-aisp78Gy9dtI',
        ApproximateFirstReceiveTimestamp: '1687811991251',
      },
      messageAttributes: {},
      md5OfBody: '8394855e8aa2cc793d9929eb87c081f9',
      eventSource: 'aws:sqs',
      eventSourceARN:
        'arn:aws:sqs:eu-central-1:357194777734:catalog-items-queue',
      awsRegion: 'eu-central-1',
    },
    {
      messageId: '4a5bdd5a-0dec-434d-8ce0-6c5c785d6777',
      receiptHandle:
        'AQEBNWURJa7f+RsWQL7qS59KYRlgB3f6TvwHM0mrHmx7biz3S0Lg1OpF/tizbae7O+/YuxXWXqgN/zWeIs15q1RJ7d4485r3d7adbhrUlCkUEr1CKfsUNEYEYo1ItnW9qWmuN0CEYyIPc3jxxMg0P2UAXaEWnkpjqPFXEkeDQiAgpdmFfEb4A6az6GtsX7375hi9RjXhlyqfNOcPhewSy/Dclp0h75X9jss9eD2kl0ENyM3aJFVdFaSK3TiAeahHHinaw5IehNYKizZak93kJmG+seL/58wL8etaL36FYi+5X1gRXT27Lr+2UIrH29m5ICjJBV4RWi7j1pG94KLjxhrSXaGFOLPbpg5Jx+6fudjl/AJmph8rzuScivbljRLhdS3BxkzIaSC4Brex0HQj25hUSw==',
      body: '{"id":"92fb7d10-0622-4159-a3a8-cbf5ab3da9c2","title":"Plant Hanger For Home","description":"Boho Decor Plant Hanger For Home Wall Decoration Macrame Wall Hanging Shelf","price":"41","count":"131"}',
      attributes: {
        ApproximateReceiveCount: '1',
        AWSTraceHeader:
          'Root=1-6499f795-0798ded11c0d79353a48ad89;Parent=6e879f587484d5a5;Sampled=0;Lineage=da4fc832:0',
        SentTimestamp: '1687811991244',
        SenderId:
          'AROAVGKTXYSDAQZ3TLYST:ImportServiceStack-ImportFileParserLambda70994A6B-aisp78Gy9dtI',
        ApproximateFirstReceiveTimestamp: '1687811991246',
      },
      messageAttributes: {},
      md5OfBody: 'b173ba5442daf68a224d13c200acbdaf',
      eventSource: 'aws:sqs',
      eventSourceARN:
        'arn:aws:sqs:eu-central-1:357194777734:catalog-items-queue',
      awsRegion: 'eu-central-1',
    },
    {
      messageId: 'ca4edc70-eabf-46ce-b428-7f9f5fba133e',
      receiptHandle:
        'AQEBkSGGJuMEeJUhka2rgzssqpjGuvQAMsxcwnFmShwuyPCsBwPGgYvhXAKhkIZIghNLD7U7wEQvgqGFW4Q6GBeBDWUVQZULDboXuDZqsRj0VOyinDH1IT4JUqoI7/MwJn+TFQwc9adz1UJF8F4ZWLGDr1AEp60xP/UHYcRHCpwyqrMYdhTbM+hYgJshCsjXcCDV9MtJgkQf3JZ5q4Qlz7X0TocJBetorjXzmvKr+0vzEnqxcQiKg1lbraMjWlDDKnAgJ6nbWn5MnrcF+Ij5OTI4/HY6zatphlTLldfyvvyXQfNu7Kq8w3vnpWwRYpibz7LTIf7lHtkQRIu89lF66i94u/q6xBh1V2+8dHsIZgFvUYDfZln1GoSUd+oVTiFTGSwYz/0ZuXIzpG1s/Vn494Fe+Q==',
      body: '{"id":"d85d8305-6503-4708-bd0b-d04a4d1e0d11","title":"Freckle Treatment Cream- 15gm","description":"Fair & Clear is Pakistan\'s only pure Freckle cream which helpsfade Freckles, Darkspots and pigments. Mercury level is 0%, so there are no side effects.","price":"70","count":"140"}',
      attributes: {
        ApproximateReceiveCount: '1',
        AWSTraceHeader:
          'Root=1-6499f795-0798ded11c0d79353a48ad89;Parent=6e879f587484d5a5;Sampled=0;Lineage=da4fc832:0',
        SentTimestamp: '1687811991231',
        SenderId:
          'AROAVGKTXYSDAQZ3TLYST:ImportServiceStack-ImportFileParserLambda70994A6B-aisp78Gy9dtI',
        ApproximateFirstReceiveTimestamp: '1687811991234',
      },
      messageAttributes: {},
      md5OfBody: 'd17f06ffb9a771a52867d4bbaa86fd6c',
      eventSource: 'aws:sqs',
      eventSourceARN:
        'arn:aws:sqs:eu-central-1:357194777734:catalog-items-queue',
      awsRegion: 'eu-central-1',
    },
  ],
};

// ProductSchema
// id: Yup.string(),
// title: Yup.string().required().default(""),
// description: Yup.string().default(""),
// price: Yup.number().positive().required().defined().default(0),

// https://fakestoreapi.com/products
// https://dummyjson.com/products
