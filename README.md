# Locality Backend

## Basic Instructions

Always start your code with the latest pull to avoid unnecessary conflicts between 2 different branches or diffenrent commit history.

All the code from all the other different developers will be merge once or twice a week into develop / sprint-1 branch.

Raise the PR for the branch you want to merge into develop / spring-1 and make sure to ask any other developer for a review in order to eliminate developer's bias before merging the branch into develop / spring-1.


#### Everyday Git Commands and some extra to take note of

```bash
git checkout -b <BRANCH_NAME>
```
replace BranchName with a name to create a new branch under that name and checkout the branch at the same time.

```bash
git checkout <BRANCH_NAME>
```
use the above command to checkout an already existing command

```bash
git pull
```
use the above command to get the latest code for a particular branch in your system,

```bash
git push

or 

git push -u origin <BRANCH_NAME>
```
use the command above to push your changes into the origin (github).


## Cloning and Running the code

```bash
git clone git@github.com:techuz-2023/techuz-test-1.git
```

Then go to the cloned repo, create your branch and install dependancies:
```bash
cd ./Locality-backend

git checkout -b YOUR_MODULE_NAME

npm install
```
