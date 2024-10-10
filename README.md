## Commonly Used vi Commands

## Modes in vi
## Insert Mode: Allows you to type text.
"i": Enter insert mode before the cursor.

Esc: Exit insert mode and return to normal (command) mode. 

## Saving and Exiting
":w": Save the file.
":q": Quit vi.
":wq": Save and quit.
":q!": Quit without saving.


# AWS Deployment Guide (EC2)

##  Set SSH Key Permissions

Before connecting to your EC2 instance, you need to set the appropriate permissions for your SSH key:

```bash
chmod 700 [key-pair].pem
```

```bash
ssh -i [key-pair].pem ubuntu@[public-dns-ec2-instance]
```

##  Clone github-repo
```bash
git clone [github-repo]
```

##  Install Node and npm
```bash
sudo apt update
sudo apt install nodejs
sudo apt install npm
```

## 4. Put env
```bash
touch .env
vi .env
```


## Docker commands and installation
```bash
sudo snap install docker
sudo docker ps
sudo docker ps -a
```
to check docker installation successful
```bash
sudo docker pull hello-world
```

```bash
sudo vi docker-compose.prod.yml
```
```plain text
version: '3.8'

services:
  [service1]:
    image: [docker-user-id]/[project-name]:[service1]
    ports:
      - "[Port1]:[Port1]"
    env_file:
      - .env

  [service2]:
    image: [docker-user-id]/[project-name]:[service2]
    ports:
      - "[Port2]:[Port2]"
    env_file:
      - .env
```


## Nginx setup
```bash
sudo apt update
sudo apt install nginx
sudo vi /etc/nginx/nginx.conf
```

```plaintext
events {
    # Event directives...
}

http {
    server {
        listen 80;

        location /service1/ {
            proxy_pass http://localhost:5000/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /service2/ {
            proxy_pass http://localhost:5001/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

```bash
sudo nginx -s reload
docker-compose -f docker-compose.prod.yml up
```


