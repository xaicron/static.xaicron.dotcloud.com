use inc::Module::Install;
name 'Xaicron-Dotcloud-Static';
all_from 'lib/Xaicron/Dotcloud/Static.pm';

#requires '';

#build_requires '';
test_requires 'Test::More', 0.96;

tests join q{ }, map { sprintf 't%s.t', '/*' x $_ } 1..3;
author_tests 'xt';

auto_set_repository();

WriteAll;
