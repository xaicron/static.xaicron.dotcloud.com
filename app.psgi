use strict;
use warnings;
use Plack::Builder;

builder {
    enable 'Static', path => qr{^/.+}, root => './htdocs/';
    sub {
        return [200, [], ["xaicron's static site"]];
    };
};
