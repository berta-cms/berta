# Angular update log

Information about what we did to update Angular so we don't get lost the next time.

**Add each next version above the previous.**


## 6.0.3 to 7.1.1

- Update Angular packages:
```bash
ng update @angular/cli @angular/core @angular/cdk @angular-devkit/build-angular
```

### Notes:
Angular CLI updates any related packages to the one updated by `ng update`, but not all packages are related.
So we must pass any "main" packages we want to update to `ng update`.

In this version something changed in "Schematics" building package, so if dev-kit wasn't updated you would get this error:
```bash
Invalid rule result: Function().
```
- https://github.com/angular/angular-cli/issues/11663
