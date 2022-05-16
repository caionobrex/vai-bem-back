## Installation

Primeiro, crie um .env na raiz do projeto com o seguinte conteudo.

```bash
DATABASE_URL=postgresql://postgres:toor@postgres:5432/vaibem?sslmode=prefer
POSTGRESQL_USER=postgres
POSTGRESQL_PASSWORD=toor
POSTGRES_DB=vaibem
POSTGRES_HOST_AUTH_METHOD=trust
SECRET_KEY=test12345
```

Segundo, build a imagem de multi-containers com docker-compose:

```bash
  docker-compose up | docker-compose up -d
```

Terceiro, accesse a CLI do container "vai-bem-back" e rode "yarn prisma migrate deploy" para executar as 
migrations do Prisma.

![Alt text](https://i.ibb.co/LJnPWrN/Screenshot-3.png "Demonstração")
